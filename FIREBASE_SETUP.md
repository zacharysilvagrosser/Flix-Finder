# Firebase Setup Instructions

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "flix-finder")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`) to add a web app
2. Enter an app nickname (e.g., "Flix Finder Web")
3. **Check** "Also set up Firebase Hosting" (optional, but recommended for deployment)
4. Click "Register app"
5. Copy the `firebaseConfig` object - you'll need these values for your `.env` file

## Step 3: Enable Authentication

1. In the Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following sign-in methods:
   - **Email/Password**: Click on it, toggle "Enable", and click "Save"
   - **Google**: Click on it, toggle "Enable", add a project support email, and click "Save"

## Step 4: Set Up Firestore Database

1. In the Firebase Console, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in **production mode**" (we'll add security rules next)
4. Select a Firestore location (choose one closest to your users)
5. Click "Enable"

## Step 5: Configure Firestore Security Rules

1. In Firestore Database, go to the "Rules" tab
2. Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own watchlist
    match /watchlists/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Step 6: Add Firebase Config to Your App

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Add your Firebase configuration values:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_from_firebase_config
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Step 7: Restart Your Development Server

If your server is running, restart it to load the new environment variables:

```bash
# Stop the server (Ctrl+C)
# Then restart it
npm start
```

## Testing

1. Open your app at `http://localhost:3000`
2. Click "Login / Sign Up" in the top right
3. Create an account or sign in with Google
4. Add movies to your watch list
5. Log out and log back in - your watch list should persist!
6. Try logging in from a different browser or device - your watch list will sync!

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Go to Firebase Console → Authentication → Settings → Authorized domains
- Add `localhost` and your deployment domain

### Watch list not saving
- Check browser console for errors
- Verify Firestore security rules are published
- Make sure user is logged in (check top right corner)

### Can't sign in with Google
- Verify Google sign-in is enabled in Firebase Console
- Check that you've set a support email in the Google sign-in settings
