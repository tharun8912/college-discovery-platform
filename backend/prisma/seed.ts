import { PrismaClient, Prisma, type College } from "@prisma/client";
import bcrypt from "bcrypt";
import { collegesData } from "./data/colleges";

const prisma = new PrismaClient();

async function main() {
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.review.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.savedComparison.deleteMany();
  await prisma.college.deleteMany();

  const created: College[] = [];
  for (const college of collegesData) {
    const c = await prisma.college.create({
      data: college as any,
    });
    created.push(c);
  }

  for (const college of created.slice(0, 6)) {
    await prisma.review.createMany({
      data: [
        {
          collegeId: college.id,
          author: "Rahul K.",
          rating: 4.5,
          comment: "Great faculty and placement cell support. Campus life is active.",
        },
        {
          collegeId: college.id,
          author: "Priya S.",
          rating: 4.0,
          comment: "Good infrastructure. Fees are reasonable for the ROI on placements.",
        },
      ],
    });
  }

  await prisma.question.create({
    data: {
      title: "Which college is better for CSE in Hyderabad under 2L fees?",
      body: "I have EAMCET rank 12,000. Confused between CBIT, VNR, and MGIT. Any seniors?",
      author: "Aspirant2026",
      answers: {
        create: [
          {
            body: "VNR and CBIT both have strong CSE placements. MGIT is more budget-friendly.",
            author: "SeniorDev",
          },
        ],
      },
    },
  });

  const demoPassword = await bcrypt.hash("demo12345", 10);
  await prisma.user.upsert({
    where: { email: "demo@campuscompass.in" },
    update: {},
    create: {
      email: "demo@campuscompass.in",
      password: demoPassword,
      name: "Demo Student",
    },
  });

  console.log(`Seeded ${created.length} colleges with rich Careers360-style data.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
