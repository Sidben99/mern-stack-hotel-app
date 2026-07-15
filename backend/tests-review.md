# Test Review Notes

## To Fix

### 1. Duplicate success test in reset-password

`reset-password.test.ts` — two tests for the same scenario:

- Line 71: `"should reset the password successfully for a valid token"` (bypasses flow, uses `createToken` directly)
- Line 100: `"should reset the password successfully"` (real flow via forget-password)

Remove the first one (line 71-99), keep the e2e version.

### 2. Fragile token extraction in e2e test

`reset-password.test.ts:116` — currently:

```ts
const token = vi.mocked(sendEmail).mock.calls[0][2].split("=")[1];
```

Replace with:

```ts
// Clear mock first to avoid depending on call order
vi.mocked(sendEmail).mockClear();
// ... trigger forget-password ...
const token = vi
  .mocked(sendEmail)
  .mock.lastCall![2].match(/token=([^&\s]+)/)![1];
```

### 3. Shared agent cookie jar

`refreshToken.test.ts:9` — `supertest.agent(app)` is shared across all tests.
If a new test is added after the happy-path test (line 35), it would inherit stale cookies.
Either create a fresh agent per test or add an `afterEach` to clear the jar.

### 4. Unused imports

- `forgetPassword.test.ts` — `LoginType`, `UserResponseType`, `ApiResponse` not used
- `reset-password.test.ts` — `UserModel`, `createToken` only used in the bypass test (which will be removed)

## Missing Tests

### 5. Logout endpoint not tested

`POST /api/auth/logout` — no test file exists. Test:

- Logout without cookie → 200 (graceful)
- Logout with valid cookie → 200, cookie cleared
- Logout with invalid cookie → 200 (graceful)

### 6. Protected root route not tested

`GET /api/` — requires auth. Test:

- No token → 401
- Valid token → 200
- Expired/invalid token → 401

## Nice-to-Have

- Extract duplicate register body into a helper factory
- Normalize test descriptions (consistent `"should return ..."` format)
- Consolidate MSW handlers or remove unused ones
