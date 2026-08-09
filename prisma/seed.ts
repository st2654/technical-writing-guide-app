import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const topics: { text: string; category: string; difficulty: string }[] = [
  { text: "Explain how DNS resolution works to a junior engineer.", category: "networking", difficulty: "easy" },
  { text: "Describe the tradeoffs between microservices and a monolith.", category: "architecture", difficulty: "medium" },
  { text: "Explain how a load balancer decides where to send a request.", category: "networking", difficulty: "easy" },
  { text: "Write a one-paragraph explanation of eventual consistency.", category: "distributed-systems", difficulty: "medium" },
  { text: "Explain why you'd choose Postgres over MongoDB for a given project.", category: "architecture", difficulty: "medium" },
  { text: "Describe how garbage collection works in a language of your choice.", category: "fundamentals", difficulty: "medium" },
  { text: "Explain the difference between authentication and authorization.", category: "security", difficulty: "easy" },
  { text: "Write a short incident postmortem for a hypothetical outage caused by a bad deploy.", category: "operations", difficulty: "hard" },
  { text: "Explain how a hash table achieves close to O(1) lookup.", category: "fundamentals", difficulty: "medium" },
  { text: "Describe how you'd onboard a new engineer to your codebase in their first week.", category: "process", difficulty: "easy" },
  { text: "Explain what a race condition is and how to prevent one.", category: "concurrency", difficulty: "medium" },
  { text: "Write documentation for a REST endpoint that creates a user account.", category: "api-docs", difficulty: "easy" },
  { text: "Explain the CAP theorem in plain language.", category: "distributed-systems", difficulty: "hard" },
  { text: "Describe how TLS establishes a secure connection.", category: "security", difficulty: "medium" },
  { text: "Explain why caching can make bugs harder to find.", category: "fundamentals", difficulty: "medium" },
  { text: "Write a design doc summary proposing a rate limiter for an API.", category: "architecture", difficulty: "hard" },
  { text: "Explain the difference between horizontal and vertical scaling.", category: "architecture", difficulty: "easy" },
  { text: "Describe how a CI/CD pipeline catches bugs before they reach production.", category: "process", difficulty: "easy" },
  { text: "Explain what idempotency means and why it matters for APIs.", category: "api-docs", difficulty: "medium" },
  { text: "Write a changelog entry for a breaking API change.", category: "communication", difficulty: "easy" },
];

async function main() {
  for (const topic of topics) {
    await prisma.topic.create({ data: topic });
  }
  console.log(`Seeded ${topics.length} topics.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
