# Codeway | Full Stack Developer Case Study

A **Region-Aware Remote Configuration Management System** built with:
- **Express.js** (Backend)
- **Vue 3 + Firebase Auth** (Frontend)
- **Firestore** (Database)
- **Optimistic Locking** and **Localization Support**
- **Easily Deployable**

---

## 🚀 Features

- ✅ **Config Panel** to manage parameters and country-specific values.
- ✅ **Secure API** with Firebase Authentication and API Token protection.
- ✅ **Optimistic Locking** with version checks.
- ✅ **Localized and Global Values** handling.
- ✅ **Deployable to any cloud**.

---

## 🗂️ Project Structure

```
/be   # Node.js + Express Backend
/fe   # Vue 3 + Firebase Frontend
```

---

## ✅ Firebase Project Setup Instructions

### 1. **Create a Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and follow the steps to create your project.

### 2. **Enable Email/Password Authentication**
1. Go to your **Firebase Console**.
2. Navigate to **Authentication > Sign-in method**.
3. Enable **Email/Password** authentication.

### 3. **Create a Firestore Database**
1. Go to **Firestore Database** in your Firebase Console.
2. Click **Create Database** and follow the steps.

### 4. **Obtain Firebase Configuration**
1. Go to **Project Settings > General > Your Apps**.
2. Copy the **Firebase Web SDK Configuration**.
3. Paste the values into your `/fe/.env`.

### 5. **Generate Service Account Key**
1. Go to **Project Settings > Service Accounts**.
2. Click **Generate New Private Key**.
3. Download the JSON file and place it as described in `/be/.env`.

---

## ⚙️ Environment Setup

### ✅ Backend `/be/.env`

```env
API_TOKEN=YOUR_SECURE_API_TOKEN
GOOGLE_APPLICATION_CREDENTIALS=PATH_TO_YOUR_SERVICE_ACCOUNT_KEY
```

> **How to get `Service Account Key File`:**
> 1. Go to **[Firebase Console](https://console.firebase.google.com/)**.
> 2. Open your project.
> 3. Go to **Project Settings > Service Accounts**.
> 4. Click **Generate New Private Key**.
> 5. Download the JSON file and place it anywhere on the project and update the variable on environment.

---

### ✅ Frontend `/fe/.env`

```env
VITE_API_BASE_URL=<your-backend-url>/api/v1
VITE_API_TOKEN=YOUR_SECURE_API_TOKEN
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> \* Please note that the _VITE_FIREBASE_API_KEY_ should be the same as _API_TOKEN_ on backend environment variables.
>
> **How to get Firebase Config:**
> 1. Go to **[Firebase Console](https://console.firebase.google.com/)**.
> 2. Open your project.
> 3. Go to **Project Settings > General > Your Apps**.
> 4. Copy the **Firebase SDK config object**.
> 5. Paste the values into your `/fe/.env` file.


---

## 🚀 Deployment on Render.com

### ✅ 1. Push Your Repo to GitHub

### ✅ 2. Deploy Backend (Web Service)
- **Root Directory:** `/be`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Environment Variables:** (see `/be/.env` section)
- **Secret Files:** Upload the service account key file you downloaded to the path you defined in your environment variables.

### ✅ 3. Deploy Frontend (Static Site)
- **Root Directory:** `/fe`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:** (see `/fe/.env` section)

### ✅ 4. Add SPA Rewrite Rule
| Source | Destination | Type    |
|-------|-------------|--------|
| `/*`   | `/index.html` | Rewrite |

---




## 🛠️ Local Development

### ✅ Backend

```bash
cd be
npm install
node server.js
```
> Access at: `http://localhost:3000`

### ✅ Frontend

```bash
cd fe
npm install
npm run dev
```
> Access at: `http://localhost:5173`

## 📋 Example API Usage

### ✅ GET All Parameters
```
GET /parameters
Headers: x-api-key, Authorization
```

### ✅ GET Parameter by Key and Country
```
GET /parameters?key=freeUsageLimit&country=TR
```

### ✅ POST New Parameter
```json
POST /parameters
{
  "key": "newParam",
  "value": "123",
  "description": "Example"
}
```

### ✅ PUT Update Parameter
```json
PUT /parameters
{
  "key": "freeUsageLimit",
  "value": "456",
  "description": "Updated",
  "version": 2
}
```

### ✅ DELETE Parameter
```json
DELETE /parameters
{
  "key": "freeUsageLimit"
}
```

---

## ✅ Final Deliverables Example
- **Frontend Panel URL:** `https://codeway-case-study-1.onrender.com`
- **API URL:** `https://codeway-case-study-1exu.onrender.com/api/v1`

---

## ✅ Contact & Support
For questions or support, please contact me at umutural1596@gmail.com

---
