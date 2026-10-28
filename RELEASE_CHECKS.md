# Release checks — 1.20.0, 2026-10-28

- Windows Node.js 24.22.1: `node --test --test-concurrency=1` — 37 tests passed across 26 test files; no failures or skipped tests.
- Source bundle rebuilt successfully. Every inline JavaScript block parses, including the application and theme initialization.
- Server request-handler tests verify the served page, English HTML default, version 1.20.0, empty configured folders/index, and rejection of foreign/unapproved native-open requests. Network/browser smoke testing was unavailable in the execution environment; these are direct handler/fixture checks, not a completed browser interaction test.
- Fresh temporary archive fixtures: scan/search, metadata, ratings, cleanup and deletion checks passed. User media was not used for deletion tests.
- Cleanup fixtures verify recent-file exclusions, retained results, one protected exact duplicate and single-use batch review tokens.
- AI tests use simulated local responses: vision capability lookup, separate text/image preferences, unsupported-model handling, eight-language framing controls, and prompt extraction/selected-text copying passed. They do not prove any model will accept all content.
- Optional vision profile: prior local inference with an ordinary café photograph succeeded on Ollama 0.40.4. The experimental model sometimes ignored the requested explanation language. Explicit-image behavior was not validated. No new multi-gigabyte download or GPU inference was required to package this release.
- PowerShell launcher/setup/check/unload scripts passed syntax parsing. Model download/setup, a fresh Node download, external AI handoff, and Recycle Bin recovery were not retested end-to-end for this packaging run.
- Both ZIPs are checked against per-file SHA-256 manifests. The served application, modules and launchers match between editions; GitHub adds tests, CI and existing companion workflow backups.
- Allowlisted package contents exclude personal archive/index, media, model weights, downloaded runtime, credentials, private settings and update logs.

These checks describe their scope; they do not guarantee every generator, model, Windows setup or file format will work.
