// Usage-limit guard — binds readme/meta/process/orchestration.md#usage-limits for
// Claude Code. PO-approved executable (2026-07-13) under the adapter contract
// (readme/meta/README.md#adapters). No dependencies; Node ≥22.18 (or ≥23.6) runs it
// directly (native type stripping — older Nodes exit 1, which a PreToolUse hook treats
// as non-blocking: verify the guard actually runs once per environment).
//
// Modes:
//   gate            PreToolUse hook for subagent spawns: exit 2 (deny) at ≥95% of an
//                   auto-detected limit or while a latch is active; else exit 0.
//   status          Print JSON: per-window utilization, resets, latch.
//   latch <ISO> [reason]   Record a real harness limit error until <ISO> (reset time).
//
// Measurement is auto-detection only (PO directive 2026-07-13: a limit that cannot be
// obtained automatically is not monitored — no manual estimates): the first-party
// usage endpoint behind /usage, via the local OAuth token ($CLAUDE_CONFIG_DIR or
// ~/.claude/.credentials.json). Read-only; the token is never logged and never sent
// anywhere but api.anthropic.com. Undocumented endpoint → 8s timeout; on any failure
// the guard FAILS OPEN and the latch (set on real limit errors) is the only backstop.
// Latch .claude/usage-limit-latch.json is runtime state; safe to delete; gitignored.

import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const LATCH = join(HERE, "..", "usage-limit-latch.json");
const THRESHOLD = 0.95;

type Window = { pct: number; resetsAt: string | null };

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
        ? { pct: x.utilization / 100, resetsAt: x.resets_at ?? null }
        : null;
    const fh = win(d.five_hour), sd = win(d.seven_day);
    if (!fh && !sd) return null;
    return { fiveHour: fh, weekly: sd };
  } catch { return null; }
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
    console.log(`NOW ALSO (orchestration.md#usage-limits): park '⏳limit ${resetsAt}' in state.md with the checkpointed work. A real limit error while detection read <95% means detection failed — check the endpoint response before trusting it again.`);
    process.exit(0);
  }

  const off = await official();
  let latch = readJson(LATCH);
  if (latch) {
    if (Date.now() < Date.parse(latch.resetsAt)) {
      if (mode === "gate") {
        console.error(`Usage limit latched (${latch.reason}) — suspend subagent spawns; resets ${latch.resetsAt}. Checkpoint and park per orchestration.md#usage-limits.`);
        process.exit(2);
      }
    } else {
      try { unlinkSync(LATCH); latch = null; } catch {}
    }
  }

  if (mode === "status") {
    console.log(JSON.stringify({ threshold: THRESHOLD, fiveHour: off?.fiveHour ?? null, weekly: off?.weekly ?? null, latch, detected: off != null }, null, 2));
    process.exit(0);
  }

  // gate
  if (!off) {
    console.log("usage-guard: limits not auto-detectable here — not monitored (PO directive); failing open. Latch on any real limit error.");
    process.exit(0);
  }
  for (const [name, w] of [["five-hour", off.fiveHour], ["weekly", off.weekly]] as const) {
    if (w && w.pct >= THRESHOLD) {
      console.error(`Usage ${Math.round(w.pct * 100)}% of ${name} limit — suspend subagent spawns; resets ${w.resetsAt ?? "unknown"}. Checkpoint and park per orchestration.md#usage-limits; resume after a verification poll at reset.`);
      process.exit(2);
    }
  }
  process.exit(0);
}

main();
