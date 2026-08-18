import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Topic } from "@prisma/client";

export async function GET() {
  const [topic] = await prisma.$queryRaw<Topic[]>`
    SELECT * FROM topics ORDER BY RANDOM() LIMIT 1
  `;

  if (!topic) {
    return NextResponse.json(
      { error: "No topics available. Run `npm run db:seed`." },
      { status: 404 },
    );
  }

  return NextResponse.json(topic);
}
