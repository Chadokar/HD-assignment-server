# Project Setup

## Prerequisites

- Node.js (version 14 or higher)
- MongoDB (local or cloud-hosted)

## Getting Started

1. **Clone the repository**:

   ```
   git clone https://github.com/your-username/hd-assignment.git
   ```

2. **Install dependencies**:

   ```
   cd hd-assignment
   npm install
   ```

   or

   ```
   npm i
   ```

3. **Configure environment variables**:

   - Create a `.env` file in the root directory.
   - Add the following environment variables:
     ```
     JWT_SECRET_KEY=<your-secret-key-for-jwt>
     EMAIL=<your-email-address>
     EMAIL_PASSWORD=<your-email-password>
     COMPANY=<your-company-name>
     DISPLAY_EMAIL=<your-display-email>
     PORT=<your-server-port>
     GOOGLE_CLIENT_ID=<your-google-client-id>
     GOOGLE_CLIENT_SECRET=<your-google-client-secret>
     GOOGLE_REDIRECT_URL=<your-google-redirect-url>
     ```

4. **Build the project**:

   ```
   npm run build
   ```

5. **Start the development server**:
   ```
   npm run dev
   ```
   The server will start running on `http://localhost:3000`.

## Available Routes

1. **Authentication**:

   - `POST /signin`: Sign in with email and password.
   - `POST /signin-otp`: Sign in with email and OTP.
   - `POST /verify-otp`: Verify OTP for sign-in.
   - `POST /signup`: Sign up with name, email, and date of birth.
   - `POST /signup-verify`: Verify OTP for sign-up.
   - `POST /save-password`: Save password after sign-up.
   - `GET /user`: Get user information.
   - `GET /google`: Google authentication (redirect).
   - `GET /google/redirect`: Google authentication (callback).

2. **Notes**:
   - `GET /notes`: Get all notes.
   - `POST /create-note`: Create a new note.
   - `DELETE /delete-note/:id`: Delete a note.

## Deployment

The backend server is currently deployed and running at: https://hd-assignment-server.onrender.com
