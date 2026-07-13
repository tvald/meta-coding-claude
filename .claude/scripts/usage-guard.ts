// Usage-limit guard — binds readme/meta/process/orchestration.md#usage-limits for
// Claude Code. PO-approved executable (2026-07-13) under the adapter contract
// (readme/meta/README.md#adapters). No dependencies; Node ≥22 runs it directly.
//
// Modes:
//   gate            PreToolUse hook for subagent spawns: exit 2 (deny) at ≥threshold
//                   of any configured limit or while a latch is active; else exit 0.
//                   Fails OPEN (exit 0 + warning) when measurement is unavailable —
//                   the authoritative backstop is the latch, set on real limit errors.
//   status          Print JSON: five-hour/weekly consumption, limits, resets, latch.
//   latch <ISO> [reason]   Record a real harness limit error until <ISO> (reset time).
//
// Config .claude/usage-limits.json (estimates — correct them whenever a real limit
// error reveals the truth): { threshold, five_hour_tokens, weekly_tokens,
// weekly_reset (any past ISO anchor of the account's weekly reset instant) }.
// Latch .claude/usage-limit-latch.json is runtime state; safe to delete; gitignored.

import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CONFIG = join(HERE, "..", "usage-limits.json");
const LATCH = join(HERE, "..", "usage-limit-latch.json");
const WEEK_MS = 7 * 24 * 3600 * 1000;

type Block = { startTime: string; endTime: string; isActive: boolean; isGap: boolean; totalTokens: number };

function readJson(path: string): any | null {
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return null; }
}

function blocks(): Block[] | null {
  try {
    const out = execSync("npx -y ccusage@latest blocks --json --offline", {
      encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 45000,
    });
    return (JSON.parse(out).blocks as Block[]).filter(b => !b.isGap);
  } catch { return null; }
}

function lastWeeklyReset(anchorIso: string, now: number): number {
  const anchor = Date.parse(anchorIso);
  if (Number.isNaN(anchor)) return NaN;
  return anchor + Math.floor((now - anchor) / WEEK_MS) * WEEK_MS;
}

function measure() {
  const cfg = readJson(CONFIG) ?? {};
  const threshold: number = cfg.threshold ?? 0.95;
  const now = Date.now();
  const bs = blocks();
  const active = bs?.find(b => b.isActive) ?? null;
  const fiveHour = {
    tokens: active?.totalTokens ?? null,
    limit: cfg.five_hour_tokens ?? null,
    pct: null as number | null,
    resetsAt: active?.endTime ?? null,
  };
  if (fiveHour.tokens != null && fiveHour.limit) fiveHour.pct = fiveHour.tokens / fiveHour.limit;

  let weekly: any = { tokens: null, limit: cfg.weekly_tokens ?? null, pct: null, resetsAt: null };
  if (bs && cfg.weekly_reset) {
    const since = lastWeeklyReset(cfg.weekly_reset, now);
    if (!Number.isNaN(since)) {
      weekly.tokens = bs.filter(b => Date.parse(b.startTime) >= since).reduce((s, b) => s + b.totalTokens, 0);
      weekly.resetsAt = new Date(since + WEEK_MS).toISOString();
      if (weekly.limit) weekly.pct = weekly.tokens / weekly.limit;
    }
  }
  const latch = readJson(LATCH);
  return { threshold, fiveHour, weekly, latch, measured: bs !== null };
}

const mode = process.argv[2] ?? "gate";

if (mode === "latch") {
  const resetsAt = process.argv[3];
  if (!resetsAt || Number.isNaN(Date.parse(resetsAt))) {
    console.error("usage: usage-guard.ts latch <reset ISO timestamp> [reason]");
    process.exit(1);
  }
  writeFileSync(LATCH, JSON.stringify({ resetsAt, reason: process.argv[4] ?? "harness limit error", latchedAt: new Date().toISOString() }, null, 2));
  console.log(`latched until ${resetsAt}`);
  process.exit(0);
}

const m = measure();

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
  console.log("usage-guard: measurement unavailable (ccusage failed) — failing open; latch on any real limit error");
  process.exit(0);
}
for (const [name, w] of [["five-hour", m.fiveHour], ["weekly", m.weekly]] as const) {
  if (w.pct != null && w.pct >= m.threshold) {
    console.error(`Usage ~${Math.round(w.pct * 100)}% of ${name} limit (est.) — suspend subagent spawns; resets ${w.resetsAt ?? "unknown"}. Checkpoint and park per orchestration.md#usage-limits; resume after a verification poll at reset.`);
    process.exit(2);
  }
}
process.exit(0);
