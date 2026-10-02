// Present only on `feature-branch`.
//
// This branch deliberately has a MUCH LARGER inventory than `main` (76 resolved packages
// vs 1, with ~15 vulnerable ones across critical/high/low), and each new direct
// dependency is actually called below so reachability has real call sites to find.
//
// That is what makes the soft-run contract observable: the feature-branch scan must
// REPORT all of these libraries and findings, while the base project's KPIs (library
// count, vulnerability counts, reachable shields) stay exactly as the `main` scan left
// them. A feature scan wrongly applied to the base project would show up as the base
// project jumping from 1 library to ~76 -- impossible to miss.
//
// It is also the content diff that lets the framework open the PR Mend needs to select
// a feature branch.
const minimist = require("minimist");
const ms = require("ms");
const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const moment = require("moment");
const _u = require("underscore");
const Handlebars = require("handlebars");
const { merge } = require("./index");

function applyDefaults(argv) {
  const args = minimist(argv || []); // CVE-2021-44906 / CVE-2020-7598
  return merge({ retries: 1, verbose: false, timeoutMs: ms("30s") }, args);
}

function renderGreeting(source, context) {
  return Handlebars.compile(source)(context); // CVE-2021-23369 / CVE-2021-23383
}

function renderTemplate(source, context) {
  return _u.template(source)(context); // CVE-2021-23358
}

function parseDate(input) {
  return moment(input, "YYYY-MM-DD").format(); // CVE-2022-24785 / CVE-2022-31129
}

function verifyToken(token, secret) {
  return jwt.verify(token, secret); // CVE-2022-23529 / CVE-2022-23539 / CVE-2022-23540
}

async function fetchStatus(url) {
  const viaAxios = await axios.get(url); // CVE-2021-3749 (+ follow-redirects)
  const viaFetch = await fetch(url); // CVE-2022-0235
  return [viaAxios.status, viaFetch.status];
}

function createApp() {
  const app = express(); // express 4.17.1 -> qs / body-parser / path-to-regexp / send ...
  app.use(express.json());
  app.get("/greet/:name", (req, res) => res.send(renderGreeting("Hello {{name}}", req.params)));
  app.post("/token", (req, res) => res.json(verifyToken(req.body.token, "secret")));
  return app;
}

module.exports = { applyDefaults, renderGreeting, renderTemplate, parseDate, verifyToken, fetchStatus, createApp };
