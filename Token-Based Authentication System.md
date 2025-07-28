# 🔐 Token-Based Authentication System (Email Verification & Forgot Password)

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

- The hashed token is stored in the user’s record in the database (e.g., user.verifyToken).
- The raw token (not hashed) is sent to the user, typically via email as a URL parameter.

```bash
https://yourapp.com/user/verify?token=RAW_TOKEN
```

🔒 APIs do not store raw tokens, ensuring security even if the database is compromised.

### 3. 🔁 Token Returned for Verification
Once the user clicks the email link:

- The token is returned to the API, either via URL, query string, or request body.
- The backend searches for the user in the database using the hashed token:

Compare the hashed token using bcrypt.compare() to match it securely.
Ensure the current time is within expiry duration.

```js
const isMatch = await bcrypt.compare(providedToken, storedHashedToken);
```

### 4. ✅ Final Verification

If token matches and is within valid expiry time:
- Update the user's isVerified = true
- Remove or clear the token and expiry from the database
- Confirmation is sent to the frontend/user

## 3⌛ Token Expiry Handling

To prevent abuse (e.g., delayed token usage), we store:
-verifyToken
-verifyTokenExpiry – a timestamp representing the allowed expiry window (e.g., 15 minutes)

On token verification:
-If token is expired, reject the request.
-This ensures time-sensitive and secure flows.

## 🔁 Forgot Password Token (Works Similarly)

The logic here is very similar to email verification but used for resetting a password.

### 🔧 Step-by-step:

1. **User Requests Password Reset**  
   - Calls API endpoint like `/forgot-password` with their email.

2. **Token Generation & Storage**  
   - API creates a long random string, hashes it, and stores it as `forgotPasswordToken` in DB.
   - A `forgotPasswordTokenExpiry` is also saved.
   - Raw token is emailed to the user with a link like:  
     `https://yourapp.com/reset-password?token=RAW_TOKEN`

3. **User Submits New Password + Token**  
   - Token is sent back to API (via request body or URL).
   - User also provides a new password.

4. **Token Verification**  
   - API finds the user by matching the hashed token.
   - Checks if token is still valid (not expired).
   - If valid:  
     - Encrypts the new password using `bcrypt`
     - Updates `user.password` in DB with this new hashed password

5. **Final Step**  
   - API clears the token from the database
   - User can now log in with the new password

---

## 🔄 Common Token Flow Summary

| Stage               | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| Token Generation    | API creates a random string and hashes it (using `bcrypt`)                 |
| Storage             | Hashed token stored in DB; raw token sent to user via email                |
| Token Return        | User sends the token back (via URL or form input)                          |
| Validation          | API checks if token matches and hasn't expired                             |
| Final Action        | API updates user record (email verified or password reset)                |

---

