# Security notes

The site is static: `index.html`, `helpers.js`, `history_drawer.js`, `i18n.js`, `head-init.js` and the CSV/JSON data files are served as they are by
GitHub Pages (`kehilot.softwine.net`). There is no server, login or cookie. Anything pushed to `main` is published immediately, so who can push to `main`
is the main security question.

## What the code does

* **Data in pages is escaped.** Every value from the CSV files goes through `escapeHtml()` before it reaches `innerHTML` or a popup; there are no inline
  event handlers, no `eval`, and no URL parameters are read.
* **Links.** A link is only created for `http(s)://` (and bare `www.`) addresses (`safeUrl()` in `helpers.js`); `javascript:`, `data:` and similar become plain text
  or no link. All external links use `rel="noopener noreferrer"`.
* **Content-Security-Policy** (a `<meta>` tag in `index.html`): scripts only from this site, the two pinned CDNs and Google Tag Manager; no inline scripts; no
  plugins; no iframes. If you add a new external script, tile server or API, add its host to the policy or the browser will block it (the console shows
  `Refused to ...`).
* **Subresource Integrity.** Every CDN script and stylesheet is pinned to an exact version and carries an `integrity` hash, as does the marker-cluster script that
  `helpers.js` loads. To upgrade a library: download the new file, compute its hash (`openssl dgst -sha384 -binary file | openssl base64 -A`), and update
  the version, the hash and (for the cluster script) `helpers.js`.
* **Suggestion form.** Text is length-limited and stripped of control characters; the CSV that is e-mailed is quoted and formula-neutralised (`csvCell()`); a
  hidden honeypot field and a 30-second pause slow down bots. These are client-side measures only: the EmailJS public key and IDs in `helpers.js` are public by
  design, so also limit them in the EmailJS dashboard (allowed domains, rate limit, CAPTCHA).
* **Data checks.** `python utils/validate_kehilot.py` fails on markup or script text in any data cell, `javascript:`/`data:`/`file:` links, local file paths, and
  warns on cells that start with `=`, `@`, `+` or `-` (spreadsheet formulas). Run it before every commit.

## Settings that are not in the code (GitHub / hosting)

* Pages > **Enforce HTTPS** should be ticked (until it is, `head-init.js` redirects plain-HTTP visitors of the live site to HTTPS, which cannot protect against
  someone who is already tampering with the connection).
* Verify the `softwine.net` domain for the organisation (Settings > Pages > Verified domains) so that nobody else can claim `kehilot.softwine.net`.
* Require two-factor authentication for every member of `softwine-ltd`; keep the number of people with write access small; protect `main` with a rule that needs a
  pull request (and does not let administrators skip it, if that is acceptable).
* Secrets never go into the repository (`.env` and key files are in `.gitignore`). A key that was committed once stays in the git history: revoke it.

## Reporting a problem

Use GitHub's "Report a vulnerability" (Security tab) if it is enabled for this repository, or open an issue that does not include exploit details.
