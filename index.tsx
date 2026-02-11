import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Check for Convex environment variable
// @ts-ignore
const convexUrl = import.meta.env.VITE_CONVEX_URL;
// @ts-ignore
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  console.warn("Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to .env.local");
}

const root = ReactDOM.createRoot(rootElement);

import { UserProvider } from './contexts/UserContext';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  // Allow bypassing Clerk if keys are missing for local dev
  const isKeyMissing = !clerkPubKey || clerkPubKey.includes('XXXXXXXXXXXXXXXXXXXX');
  
  if (isKeyMissing) {
      console.warn("Clerk keys missing. Running in offline/local mode.");
      return <>{children}</>;
  }
  return (
    <ClerkProvider publishableKey={clerkPubKey} afterSignOutUrl="/">
      {children}
    </ClerkProvider>
  );
};

if (convexUrl) {
  const convex = new ConvexReactClient(convexUrl);
  root.render(
    <React.StrictMode>
      <AuthWrapper>
        <ConvexProvider client={convex}>
          <UserProvider>
            <App isConvexEnabled={true} />
          </UserProvider>
        </ConvexProvider>
      </AuthWrapper>
    </React.StrictMode>
  );
} else {
  console.warn("Convex URL not found. Running in offline mode. Run 'npx convex dev' to enable backend.");
  root.render(
    <React.StrictMode>
      <AuthWrapper>
        <UserProvider>
          <App isConvexEnabled={false} />
        </UserProvider>
      </AuthWrapper>
    </React.StrictMode>
  );
}