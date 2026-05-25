import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const people = [
    {
      name: "Ana López",
      role: "Developer",
    },
    {
      name: "Luis García",
      role: "Designer",
    },
    {
      name: "María Torres",
      role: "Project Manager",
    },
  ];

  for (const person of people) {
    const existingPerson = await prisma.person.findFirst({
      where: {
        name: person.name,
      },
    });

    if (!existingPerson) {
      await prisma.person.create({
        data: person,
      });
    }
  }

  console.log("Seed data created successfully.");
}

main()
  .catch((error) => {
    console.error("Error creating seed data:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });