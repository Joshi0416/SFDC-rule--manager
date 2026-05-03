# Salesforce Validation Rule Manager

A React-based web application to view and manage Salesforce Account Validation Rules. This application connects to your Salesforce Developer Org, fetches the validation rules via Tooling API, and allows you to toggle their active states directly from the web interface.

## Prerequisites

1. **Node.js** installed on your local machine.
2. A **Salesforce Developer Org** (sign up at [developer.salesforce.com/signup](https://developer.salesforce.com/signup)).

## Salesforce Setup

1. **Create Validation Rules**: In your Salesforce Org, navigate to **Setup > Object Manager > Account > Validation Rules** and create a few sample rules.
2. **Create Connected App**:
   - Go to **Setup > App Manager > New Connected App**.
   - Enable OAuth Settings.
   - Set **Callback URL** to `http://localhost:5173/callback`.
   - Add OAuth Scopes: `Manage user data via APIs (api)`, `Perform requests at any time (refresh_token, offline_access)`, `Access and manage your data (web)`.
   - Save and copy your **Consumer Key (Client ID)**.
3. **Configure CORS**:
   - Go to **Setup > CORS** in Salesforce.
   - Click **New** and add `http://localhost:5173` to the Allowed Origins.

## Local Setup & Running

1. Clone this repository (or copy the project files).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Open the `.env` file and replace `YOUR_CLIENT_ID_HERE` with your Connected App's Consumer Key:
   ```env
   VITE_SF_CLIENT_ID=YOUR_CLIENT_ID_HERE
   ```
4. Start the local server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

## Features

- **OAuth 2.0 Integration**: Uses Salesforce's secure User-Agent flow for Single Page Applications.
- **Fetch Rules**: Retrieves Account Validation Rules using the Salesforce Tooling API.
- **Bulk & Individual Actions**: Toggle all rules at once or switch them individually.
- **Deploy Changes**: Persist active/inactive state changes back to Salesforce.
- **Modern UI**: Sleek, responsive design with smooth animations.
