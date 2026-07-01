# CatWatch Security Specification

## 1. Data Invariants
- A `sighting` must have an `imageUrl`, `latitude`, `longitude`, `observedAt`, `createdBy`, and `createdAt` timestamp.
- The `latitude` and `longitude` must be numbers.
- Identifiers (`createdBy`) must match `request.auth.uid`.
- `createdAt` must match `request.time`.
- `size` must be one of: 'kitten', 'small', 'medium', 'large' if provided.
- `hasCollar` must be boolean if provided.
- Strings like `notes`, `coatColor`, `pattern`, `imageUrl` must have a maximum size limit to prevent Denial of Wallet.

## 2. The "Dirty Dozen" Payloads
1. **Unauthenticated create**: Missing Auth. Expected: `PERMISSION_DENIED`
2. **Missing required fields**: Create sighting without `latitude`. Expected: `PERMISSION_DENIED`
3. **Ghost fields**: Create sighting with `isAdmin: true`. Expected: `PERMISSION_DENIED`
4. **Invalid type**: `latitude` as string. Expected: `PERMISSION_DENIED`
5. **Unauthorized identity**: `createdBy` does not match auth `uid`. Expected: `PERMISSION_DENIED`
6. **Denial of Wallet**: `imageUrl` or `notes` containing 200KB of string data. Expected: `PERMISSION_DENIED`
7. **Future/Past spoofing**: `createdAt` set to a future timestamp instead of `request.time`. Expected: `PERMISSION_DENIED`
8. **Update manipulation**: Attempting to change `createdBy` on an existing sighting. Expected: `PERMISSION_DENIED`
9. **Outcome/Terminal manipulation**: Changing `createdAt` after creation. Expected: `PERMISSION_DENIED`
10. **Query scrapers**: `allow list` without matching constraints. Expected: `PERMISSION_DENIED` (Actually, sightings are public! We want them public on the app. Oh wait, if they are public, list queries are allowed for everyone, reading public fields.)
11. **Spoofed ID**: Document ID is massive. Expected `PERMISSION_DENIED`.
12. **Malicious array size**: N/A for this schema as there are no arrays.

## 3. The Test Runner
Tests will assert that these invariants are successfully protected by Firestore rules.
