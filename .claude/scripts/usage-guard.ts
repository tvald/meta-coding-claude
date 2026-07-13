// Usage-limit guard — binds readme/meta/process/orchestration.md#usage-limits for
// Claude Code. PO-approved executable (2026-07-13) under the adapter contract
// (readme/meta/README.md#adapters). No dependencies; Node ≥22.18 (or ≥23.6) runs it
// directly (native type stripping — older Nodes exit 1, which a PreToolUse hook treats
// as non-blocking: verify the guard actually runs once per environment).
//
// Modes:
//   gate            PreToolUse hook for subagent spawns: exit 2 (deny) at ≥threshold
//                   of any limit or while a latch is active; else exit 0. Fails OPEN
//                   (exit 0 + warning) when no measurement source is available — the
//                   authoritative backstop is the latch, set on real limit errors.
//   status          Print JSON: per-window utilization, source, resets, latch.
//   latch <ISO> [reason]   Record a real harness limit error until <ISO> (reset time).
//
// Measurement sources, in order (PO-approved auto-detection, 2026-07-13):
//   1. official — GET https://api.anthropic.com/api/oauth/usage with the local OAuth
//      token ($CLAUDE_CONFIG_DIR or ~/.claude/.credentials.json). First-party,
//      read-only, exact utilization + reset instants; the token is never logged and
//      never sent anywhere but api.anthropic.com. Undocumented endpoint → 8s timeout,
//      silent fallback on any failure.
//   2. estimate — ccusage token counts vs .claude/usage-limits.json (optional:
//      { threshold, five_hour_tokens, weekly_tokens, weekly_reset }).
//   3. none — fail open; latch is the only enforcement.
// Latch .claude/usage-limit-latch.json is runtime state; safe to delete; gitignored.

import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { execSync } from "node:child_process";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CONFIG = join(HERE, "..", "usage-limits.json");
const LATCH = join(HERE, "..", "usage-limit-latch.json");
const WEEK_MS = 7 * 24 * 3600 * 1000;

type Window = { pct: number | null; resetsAt: string | null; source: "official" | "estimate" | "none"; tokens?: number | null; limit?: number | null };
type Block = { startTime: string; endTime: string; isActive: boolean; isGap: boolean; totalTokens: number };

function readJson(path: string): any | null {
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return null; }
}

async function official(): Promise<{ fiveHour: Window | null; weekly: Window | null } | null> {
  try {
    const cfgDir = process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude");
    const raw = readJson(join(cfgDir, ".credentials.json"));
    const k = raw?.claudeAiOauth ?? raw;
    if (!k?.accessToken) return null;
    const r = await fetch("https://api.anthropic.com/api/oauth/usage", {
      headers: { Authorization: `Bearer ${k.accessToken}`, "anthropic-beta": "oauth-2025-04-20" },
      signal: AbortSignal.timeout(8000),
      redirect: "error", // never legitimately 3xx; belt-and-braces against token exposure
    });
    if (!r.ok) return null;
    const d: any = await r.json();
    const win = (x: any): Window | null =>
      x && typeof x.utilization === "number"
        ? { pct: x.utilization / 100, resetsAt: x.resets_at ?? null, source: "official" }
        : null;
    const fh = win(d.five_hour), sd = win(d.seven_day);
    if (!fh && !sd) return null;
    return { fiveHour: fh, weekly: sd }; // per-window; a missing window falls back to estimates
  } catch { return null; }
}

function blocks(): Block[] | null {
  try {
    // Pinned: @latest would hit the registry on the hot path and can stall a cold
    // cache to the timeout, silently failing open. Bump deliberately.
    const out = execSync("npx -y ccusage@20.0.17 blocks --json --offline", {
      encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 45000,
    });
    return (JSON.parse(out).blocks as Block[]).filter(b => !b.isGap);
  } catch { return null; }
}

function estimates(cfg: any): { fiveHour: Window; weekly: Window; measured: boolean } {
  const none: Window = { pct: null, resetsAt: null, source: "none" };
  const bs = blocks();
  if (!bs) return { fiveHour: none, weekly: none, measured: false };
  const active = bs.find(b => b.isActive) ?? null;
  const fiveHour: Window = {
    tokens: active?.totalTokens ?? null, limit: cfg.five_hour_tokens ?? null,
    pct: null, resetsAt: active?.endTime ?? null, source: "estimate",
  };
  if (fiveHour.tokens != null && fiveHour.limit) fiveHour.pct = fiveHour.tokens / fiveHour.limit;
  const weekly: Window = { tokens: null, limit: cfg.weekly_tokens ?? null, pct: null, resetsAt: null, source: "estimate" };
  if (cfg.weekly_reset) {
    const anchor = Date.parse(cfg.weekly_reset);
    if (!Number.isNaN(anchor)) {
      const since = anchor + Math.floor((Date.now() - anchor) / WEEK_MS) * WEEK_MS;
      // Known bias: a block straddling the weekly reset counts zero toward the new
      // week (estimate-level tool; accepted in review 2026-07-13).
      weekly.tokens = bs.filter(b => Date.parse(b.startTime) >= since).reduce((s, b) => s + b.totalTokens, 0);
      weekly.resetsAt = new Date(since + WEEK_MS).toISOString();
      if (weekly.limit) weekly.pct = weekly.tokens / weekly.limit;
    }
  }
  return { fiveHour, weekly, measured: true };
}

async function measure() {
  const cfg = readJson(CONFIG) ?? {};
  const threshold: number = cfg.threshold ?? 0.95;
  const off = await official();
  let fiveHour = off?.fiveHour ?? null;
  let weekly = off?.weekly ?? null;
  let measured = off != null;
  if (!fiveHour || !weekly) {
    const est = estimates(cfg); // per-window fallback for whatever official didn't cover
    fiveHour = fiveHour ?? est.fiveHour;
    weekly = weekly ?? est.weekly;
    measured = measured || est.measured;
  }
  return { threshold, fiveHour, weekly, latch: readJson(LATCH), measured };
}

async function main() {
  const mode = process.argv[2] ?? "gate";

  if (mode === "latch") {
    const resetsAt = process.argv[3];
    if (!resetsAt || Number.isNaN(Date.parse(resetsAt))) {
      console.error("usage: usage-guard.ts latch <reset ISO timestamp> [reason]");
      process.exit(1);
    }
    writeFileSync(LATCH, JSON.stringify({ resetsAt, reason: process.argv[4] ?? "harness limit error", latchedAt: new Date().toISOString() }, null, 2));
    console.log(`latched until ${resetsAt}`);
    console.log(`NOW ALSO (orchestration.md#usage-limits): park '⏳limit ${resetsAt}' in state.md with the checkpointed work. A real limit error while the official source read <95% means detection failed — check the endpoint response before trusting it again.`);
    process.exit(0);
  }

  const m = await measure();

  if (m.latch) {
    if (Date.now() < Date.parse(m.latch.resetsAt)) {
      if (mode === "gate") {
        console.error(`Usage limit latched (${m.latch.reason}) — suspend subagent spawns; resets ${m.latch.resetsAt}. Checkpoint and park per orchestration.md#usage-limits.`);
        process.exit(2);
      }
    } else {
      try { unlinkSync(LATCH); m.latch = null; } catch {}
    }
  }

  if (mode === "status") {
    console.log(JSON.stringify(m, null, 2));
    process.exit(0);
  }

  // gate
  if (!m.measured) {
    console.log("usage-guard: no measurement source (official endpoint and ccusage both unavailable) — failing open; latch on any real limit error");
    process.exit(0);
  }
  for (const [name, w] of [["five-hour", m.fiveHour], ["weekly", m.weekly]] as const) {
    if (w.pct != null && w.pct >= m.threshold) {
      console.error(`Usage ${Math.round(w.pct * 100)}% of ${name} limit (${w.source}) — suspend subagent spawns; resets ${w.resetsAt ?? "unknown"}. Checkpoint and park per orchestration.md#usage-limits; resume after a verification poll at reset.`);
      process.exit(2);
    }
  }
  process.exit(0);
}

main();
