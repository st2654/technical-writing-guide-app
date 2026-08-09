"use client";

import { signIn, signOut } from "next-auth/react";

export function SignInButton() {
  return (
    <button onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>
      Sign in with GitHub
    </button>
  );
}

export function SignOutButton() {
  return <button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>;
}
