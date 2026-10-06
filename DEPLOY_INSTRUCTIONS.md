# AWS Deployment Guide: JobNinjas

Follow these steps to deploy the backend to **App Runner** and the frontend to **Amplify**.

## 1. Backend: AWS App Runner

Since you have already built and pushed the Docker image using `deploy_backend.ps1`, you can now create the App Runner service.

### Step-by-Step
1. **Go to App Runner Console**: [AWS App Runner](https://console.aws.amazon.com/apprunner/home)
2. **Create Service**:
   - **Source**: Container registry
   - **Type**: Amazon ECR
   - **Repository**: Select `jobninjas-backend`
   - **Tag**: `latest`
   - **Deployment Settings**: Automatic (this will redeploy whenever you push a new image to ECR)
3. **Service Configuration**:
   - **Service Name**: `jobninjas-api`
   - **Port**: `8000` (Matches the Port in Dockerfile)
4. **Environment Variables**:
   Add ALL variables from your `.env` file to the App Runner configuration. 
   > [!IMPORTANT]
   > Make sure to update `FRONTEND_URL` to your production domain once you have it.
5. **Auto Scaling & Networking**:
   - Default settings are fine for now. 
6. **Review & Create**: Click **Create & Deploy**.

---

## 2. Frontend: AWS Amplify

Amplify provides the easiest way to host your React frontend with built-in CI/CD.

### Step-by-Step
1. **Go to Amplify Console**: [AWS Amplify](https://console.aws.amazon.com/amplify/home)
2. **New App**: Click **Create new app** or **Get Started** under "Amplify Hosting".
3. **Connect GitHub**:
   - Select **GitHub** and authorize AWS.
   - Choose your repository and the main branch.
4. **Build Settings**:
   - Amplify should automatically detect the React build settings.
   - In the **Environment Variables** section, add:
     - `REACT_APP_BACKEND_URL`: Paste your **App Runner URL** (e.g., `https://xxxxxx.us-east-1.awsapprunner.com`)
5. **Deploy**: Click **Save and Deploy**.

---

## 3. Final Cutover

Once both services are running:

1. **Test the Live Site**: Go to the Amplify URL.
2. **Verification**: Try signing up or logging in. Since we migrated the data, your existing Supabase users will be in the RDS database.
3. **CORS**: If you see CORS errors, update the `FRONTEND_URL` in your **App Runner environment variables** to match your new Amplify domain.

> [!TIP]
> If you need to debug, check the **Service logs** in the App Runner console.
