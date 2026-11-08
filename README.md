# Forma

A complete HTML, CSS, and vanilla JavaScript learning workspace with a Node.js/Express server. Create tests from your own questions, TXT/DOCX/PDF documents, local practice generation, or OpenAI. Publish tests, take quizzes, review answers, and track results.

## Run

Requires Node.js 22+ (tested on Node 24).

```sh
npm ci --cache /tmp/forma-npm-cache
cp .env.example .env
# Edit .env to provision your Owner account before allowing public access.
npm start
```

The server listens on port 3000 by default. `npm run dev` enables server watch mode. No build step is required. Do not commit `.env` or `.data`.

## Website files and deployment

Frontend files live directly at the repository root: `index.html`, `favicon.svg`, `css/`, and `js/`. The Node server serves these files explicitly and keeps server code, configuration, dependencies, and stored data private.

Deploy the repository root to a Node.js host with `npm ci` as the install command and `npm start` as the start command. No build command is needed. Static-only hosting such as GitHub Pages cannot run the API required for accounts, document import, generation, tests, and results; those features need the Node server.

## Accounts and permissions

- **Owner:** provisioned once from `OWNER_EMAIL` and `OWNER_PASSWORD` (12+ characters). There is no public Owner signup or role promotion. Use an email not already registered to a user. Once provisioned, credentials remain in the database; changing the environment variable does not reset the password.
- **Admin:** granted by Owner in People & roles; can view members and moderate/edit all community tests.
- **Teacher:** public signup; create, edit, publish, unpublish, and delete own tests.
- **Student:** public signup; take published tests and view personal results.

All signed-in roles can take tests. Demo tests are read-only. Drafts are visible only to authors and moderators. Answer keys are omitted from test-taking responses and returned for review after submission. Role and resource access are enforced by the server, not only hidden in the interface.

## Creating tests

Use **Create a test** for source-based generation or manual authoring. Import accepts `.txt`, `.docx`, and text-based `.pdf` files up to 10 MB, extracting up to 50,000 characters. Scanned PDFs require external OCR; encrypted or invalid documents may not import. Source text is shown before generation. Imported files are processed in memory and not stored. The local practice generator creates simple fill-in-the-blank questions, sometimes fewer than requested if there is insufficient source material. It is not AI.

For real AI generation, configure `OPENAI_API_KEY` on the server and optionally `OPENAI_MODEL` (default `gpt-4.1-mini`). AI mode sends the supplied text to OpenAI. Keys never reach the browser. AI content must be reviewed for accuracy. Local practice and manual creation require no API key. AI integration is implemented but cannot be validated without a provider key and network access to `api.openai.com`.

Review/edit prompts, four options, and the correct choice before saving a draft or publishing. Saved tests can be edited again from My tests. Admins and Owner can moderate from People & roles. Results retain the title and score from the time of submission even if a test later changes or is deleted.

## Storage and deployment

A single Node process persists accounts, tests, and attempts to `.data/database.json` using atomic writes. Passwords use salted scrypt hashes. Authentication uses opaque, expiring HttpOnly SameSite cookies; sessions are held in memory and reset after server restart. Back up `.data` securely. This small-workspace implementation is not designed for multiple server replicas: use a transactional database and shared session store before scaling.

For Internet deployment, put the app behind HTTPS, set `COOKIE_SECURE=true`, and restrict direct access to the Node port. The server trusts one reverse proxy hop. There is basic in-memory request limiting on signup, signin, import, and generation. No email verification, password recovery, proctoring, or high-stakes exam integrity is provided. Use a single-instance private workspace deployment until those operational requirements are addressed.

## Validation

```sh
npm run check
npm test
npm run test:e2e
```

Browser tests launch an isolated server and use Chromium. Set `CHROMIUM_PATH` if Chromium is not installed at `/usr/bin/chromium`. Tests cover signup, source generation, draft editing/publishing, taking a test, saved results, owner/admin permissions, and file import. No external AI key is needed.
