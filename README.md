# JusticeBot.AI - Deployment Guide

This guide provides the final steps to deploy your JusticeBot.AI application and connect your custom domain.

## Prerequisites

*   You have a [Firebase](https://firebase.google.com/) account.
*   You have [Node.js](https://nodejs.org/) installed on your computer (version 20 or later is recommended).
*   You have the [Firebase CLI](https://firebase.google.com/docs/cli#install-cli-npm) installed.

## Step 1: Set Up Your Local Environment

1.  **Copy Files:** Create a folder on your computer and copy all the project files from Firebase Studio into it.
2.  **Install Dependencies:** Open your terminal, navigate into your new project folder, and run:
    ```bash
    npm install
    ```
3.  **Set Up Environment Variables:** Open the `.env` file in the root of your project. Replace the placeholder values (e.g., `your_firebase_api_key_here`) with your actual Firebase project credentials. You can find these in your Firebase project settings. This step is **critical** for the app to run locally.


## Step 2: Initialize Firebase

This connects your local folder to your Firebase project.

1.  **Log In to Firebase:**
    ```bash
    firebase login
    ```
2.  **Initialize Firebase:**
    ```bash
    firebase init
    ```
3.  **Follow the Prompts:**
    *   Select **App Hosting**.
    *   Choose **Use an existing project** and select your `justicebotai` project.
    *   Provide the backend ID when prompted (you can find this in the App Hosting section of the Firebase Console).

## Step 3: Deploy Your Application

Now you can deploy the application to Firebase.

```bash
firebase apphosting:deploy
```

The CLI will build and deploy your app. When it's finished, it will give you a URL where you can see your live application.

## Step 4: Connect Your Custom Domain (`justice-bot.com`)

1.  **Go to App Hosting in Firebase:** Open the App Hosting section of your Firebase Console.
2.  **Add Custom Domain:** Find your new deployment and click **"Add custom domain"**.
3.  **Enter Your Domain:** Type in `www.justice-bot.com`. Firebase will also guide you on setting up the root domain (`justice-bot.com`).
4.  **Update DNS Records:** Firebase will provide you with DNS records (typically `A` records). Log in to your domain registrar (where you bought `justice-bot.com`) and add these records.
5.  **Wait for Propagation:** DNS changes can take a few hours to update across the internet. Once verified, Firebase will automatically provision an SSL certificate, and your site will be live at `https://www.justice-bot.com`.
