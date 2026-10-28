const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

if (!publishableKey) {
  throw new Error(
    "Clerk publishable key is missing. Set VITE_CLERK_PUBLISHABLE_KEY in .env.local and restart the dev server.",
  );
}

export const CLERK_PUBLISHABLE_KEY = publishableKey;