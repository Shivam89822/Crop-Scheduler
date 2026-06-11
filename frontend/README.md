# Crop Scheduler Frontend

Expo React Native frontend for the Crop Scheduler MVP. It connects to the APIs
currently implemented in `../backend` and falls back to preview data when the
backend is unavailable.

## Included flows

- Today's task dashboard
- Mark task complete
- Farm list and total acreage
- Add a farm
- Add chilli or cotton crop and generate its schedule
- Preview mode while the backend is offline

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env`.

3. Set `EXPO_PUBLIC_API_BASE_URL`:

   - Android emulator: `http://10.0.2.2:5000/api`
   - iOS simulator: `http://localhost:5000/api`
   - Physical phone: `http://YOUR_COMPUTER_LAN_IP:5000/api`

4. Start the backend, then start Expo:

   ```bash
   npm start
   ```

The current backend has no authentication endpoint, so the frontend sends
`EXPO_PUBLIC_DEMO_USER_ID` when creating farms. Replace this once OTP/JWT
authentication is implemented.
