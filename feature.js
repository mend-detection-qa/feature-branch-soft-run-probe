// Present only on `feature-branch`.
//
// This branch deliberately has a DIFFERENT inventory from `main`: it adds `minimist`
// (1.2.5, vulnerable -- CVE-2021-44906 prototype pollution, reached via the call below)
// and `ms` (clean). That is what makes the soft-run contract observable: the
// feature-branch scan must REPORT the new libraries and the new finding, while the base
// project's KPIs (library count, vulnerability counts, reachable shields) stay exactly
// as the base-branch scan left them. With an identical inventory, "the counts did not
// move" would also be what a wrongly-applied feature scan looks like.
//
// It is also the content diff that lets the framework open the PR Mend needs to select
// a feature branch.
const minimist = require("minimist");
const ms = require("ms");
const { merge } = require("./index");

module.exports = function applyDefaults(argv) {
  const args = minimist(argv || []);
  return merge({ retries: 1, verbose: false, timeoutMs: ms("30s") }, args);
};
