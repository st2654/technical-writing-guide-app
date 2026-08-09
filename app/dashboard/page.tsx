import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "../components/auth-buttons";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <main style={{ maxWidth: 480, margin: "4rem auto", padding: "0 1.5rem" }}>
      <p>Good morning</p>
      <h1>Ready for today&apos;s sprint?</h1>
      <p>Signed in as {session?.user?.name ?? session?.user?.email}</p>
      <SignOutButton />
    </main>
  );
}
