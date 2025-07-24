# 🔐 Token-Based Authentication System (Email Verification & Forgot Password)

This `README.md` explains how a secure token-based system works in a web application for:

- ✅ Email verification
- 🔁 Forgot password/reset password

Both of these processes follow a **common token flow**, where tokens are generated, securely stored, sent to users, and later verified — all without being permanently stored by the API.

---

## 📦 Components of the System

Our application is divided into three core parts:

1. **User / Browser / Email**  
   → Makes requests and receives tokens via email or web page.

2. **API / Controllers**  
   → Generates tokens, validates them, and updates user data.

3. **Database**  
   → Stores hashed tokens and associated expiry timestamps for validation.

---

## ✅ Email Verification Flow

When a new user registers, we need to verify their email.

### 🔧 Step-by-step:

1. **Token Generation**:  
   The API creates a long random string and hashes it using `bcrypt`.  
   Example: `f8f0e4f6a23...` → `hashed version saved in DB`

2. **Token Storage & Sending**:  
   - Hashed token is saved in the user’s database record (`verifyToken`).
   - Raw token is sent to the user via email as a URL link like:  
     `https://yourapp.com/verify?token=RAW_TOKEN`

3. **User Clicks Verification Link**:  
   - API receives the raw token from the request.
   - It finds the user by matching the hashed token and also checks if the token has **not expired**.
   - If valid, the user’s account is marked as `isVerified = true`.

4. **Token Expiry**:  
   - A `verifyTokenExpiry` timestamp is stored when the token is generated.
   - Verification only succeeds **within that time window** (e.g., 15 mins).

---

## 🔁 Forgot Password Flow

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

## 🧠 Key Security Practices

- 🔒 **Never** store raw tokens in DB — only store hashed versions
- 🔐 Always use strong random generators (`crypto`, `uuid`)
- 🕒 Set expiry time for every token (e.g., 15–30 minutes)
- ✅ Always compare tokens using secure methods like `bcrypt.compare()`
- 🧹 Remove token from DB after successful use

---

## 📚 Technologies Used

- **Node.js**
- **bcrypt.js** (for hashing tokens and passwords)
- **MongoDB / SQL** (for user record storage)
- **REST APIs** (for user actions)
- **Email service** (to deliver tokens to users)

---

## 🧩 Example Use Cases Covered

- Email verification after signup
- Forgot password with secure reset
- Any action requiring token-based security (e.g., 2FA, magic links)

---

This system ensures a secure, efficient, and clean way to handle email verification and password resets using best practices and token-based authentication.
