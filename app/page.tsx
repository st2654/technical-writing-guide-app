import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { SignInButton, SignOutButton } from "./components/auth-buttons";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main style={{ maxWidth: 480, margin: "4rem auto", padding: "0 1.5rem" }}>
      <h1>Technical writing sprints</h1>
      <p>5-minute daily writing reps, scored and gamified.</p>

      {session?.user ? (
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link href="/dashboard">Go to dashboard</Link>
          <SignOutButton />
        </div>
      ) : (
        <SignInButton />
      )}
    </main>
  );
}
