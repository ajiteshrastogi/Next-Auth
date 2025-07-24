# 🔐 User Verification & Token Handling in Authentication Systems

This document explains how token-based verification (such as email verification and forgot password token systems) works within a typical authentication system. This guide is based on a backend system using APIs, bcrypt.js, and a database, designed to ensure secure user verification.

---

## 🧠 System Overview

Our application consists of **three main components**:

1. **User/Browser**: The client making requests (e.g., account creation, verification, password reset).
2. **API (Controllers)**: Handles business logic, processes requests, generates tokens, and communicates with the database.
3. **Database**: Stores user information, tokens, and verification status securely.

---

## 🔁 Verification Token Flow

Here’s how a typical **email verification** process works:

### 1. 📩 Token Generation on API Request

When a user signs up or requests email verification (`/user/verify` endpoint), the API:

- Generates a **random, secure string** (token) using a utility like `crypto` or `uuid`.
- Optionally encrypts the token using `bcrypt.js` for added security.

```js
// Example (simplified):
const token = crypto.randomBytes(32).toString('hex');
const hashedToken = await bcrypt.hash(token, saltRounds);
```

### 2. 🧾 Token Storage & Distribution

-The hashed token is stored in the user’s record in the database (e.g., user.verifyToken).
-The raw token (not hashed) is sent to the user, typically via email as a URL parameter.

```bash
https://yourapp.com/user/verify?token=RAW_TOKEN
```

🔒 APIs do not store raw tokens, ensuring security even if the database is compromised.

### 3. 🔁 Token Returned for Verification
Once the user clicks the email link:

-The token is returned to the API, either via URL, query string, or request body.
-The backend searches for the user in the database using the hashed token:

Compare the hashed token using bcrypt.compare() to match it securely.
Ensure the current time is within expiry duration.

```js
const isMatch = await bcrypt.compare(providedToken, storedHashedToken);
```

### 4. ✅ Final Verification

If token matches and is within valid expiry time:
-Update the user's isVerified = true
-Remove or clear the token and expiry from the database
-Confirmation is sent to the frontend/user

## 3⌛ Token Expiry Handling

To prevent abuse (e.g., delayed token usage), we store:
-verifyToken
-verifyTokenExpiry – a timestamp representing the allowed expiry window (e.g., 15 minutes)

On token verification:
-If token is expired, reject the request.
-This ensures time-sensitive and secure flows.

## 🔁 Forgot Password Token (Works Similarly)

The forgot password logic mirrors the verify token logic:
-API generates token, stores hashed version in DB, sends raw token to user.
-On receiving the token back via a reset form, validate it.
-If valid and within expiry, allow password reset and clear token from DB.