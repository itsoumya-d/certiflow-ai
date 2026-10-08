# Evidence persistence and failure recovery

The evidence API is a prototype JSON metadata store at `process.cwd()/evidence.json`.
It does not persist uploaded file contents. Analysis runs as best-effort background
work in the server process, not a durable job queue.

## Mutation contract

- An absent file starts an empty store. Unreadable files, invalid JSON, malformed
  entries, and duplicate IDs produce an error instead of being silently replaced.
- Upload and delete return success only after the metadata replacement succeeds.
  Replacement writes a unique, exclusive temporary file in the same directory,
  with owner-only permissions (0600), then renames it over the destination. Write or rename failures preserve the
  previous destination bytes and return HTTP 500. Temporary-file cleanup is
  attempted; cleanup failures are logged without hiding the original error.
- File-valued metadata fields and text supplied instead of an uploaded file are
  rejected with HTTP 400 before touching storage.
- Failed initial upload persistence does not start analysis. The upload form keeps
  its selected file and fields for retry when the API reports failure.
- Background status writes can fail after a successful upload. Failures are logged;
  the route attempts to persist `failed`, and also catches failure of that attempt.
  A subsequent GET reports only the last successfully persisted state, which may
  remain `pending` or `analyzing`. There is no automatic restart recovery.
- Authentication, admin-only deletion, and missing-record responses are unchanged.

This is not a multi-process transaction protocol or a power-loss durability
promise: there is no locking, database transaction, or filesystem `fsync` step.
Shared multi-instance deployments need an appropriate database and job queue.
These tests do not establish compliance certification or a security audit.

## Credential-free failure/retry demonstration

After `npm ci`, run:

```sh
npm test -- --runInBand __tests__/api/evidence-persistence.test.ts
npm test -- --runInBand __tests__/app/evidence-upload-retry.test.tsx
```

The route tests invoke the actual POST, GET and DELETE handlers with synthetic
sessions and documents, mocked Gemini analysis, and an isolated in-memory
filesystem. They inject read, partial-write, rename and background status failures,
check unchanged previous bytes, retry uploads, and verify the new record with a
fresh GET. They never touch the repository's evidence file or call Gemini.

The UI test renders the actual evidence page with mocked HTTP responses. It checks
that a failed upload keeps the file, fields and modal, that retry sends the same
values, and that the subsequent GET renders the saved record. This is a component
regression, not a live-browser or production-storage test.

The existing CI matrix remains unchanged: Node 22 and 24 run typechecking, lint,
all Jest tests, and the Next.js build. Existing baseline tests are retained.
