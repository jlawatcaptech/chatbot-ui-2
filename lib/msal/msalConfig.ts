import { PublicClientApplication } from "@azure/msal-browser"

const CLIENT_ID = process.env.NEXT_PUBLIC_AZURE_CLIENT_ID
const AUTHORITY = `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`
const REDIRECT_URI = process.env.NEXT_PUBLIC_CALLBACK_URI

// console.log(`acid: ${CLIENT_ID}`);
// console.log(`aa: ${AUTHORITY}`);
// console.log(`aru: ${REDIRECT_URI}`);

if (!CLIENT_ID || !AUTHORITY || !REDIRECT_URI) {
  throw new Error(
    "Azure URL and Keys are required. Check if Environmental Variables are setup correctly."
  )
}

const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    authority: AUTHORITY,
    redirectUri: REDIRECT_URI
  }
}

export const msalInstance = new PublicClientApplication(msalConfig)
