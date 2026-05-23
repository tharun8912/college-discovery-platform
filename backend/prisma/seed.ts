import { PrismaClient, Prisma, type College } from "@prisma/client";
import bcrypt from "bcrypt";
import { collegesData } from "./data/collegesData";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Clean old data to avoid unique constraint violations
  console.log("Cleaning old database entries...");
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.review.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.savedComparison.deleteMany();
  await prisma.college.deleteMany();

  console.log(`Seeding ${collegesData.length} colleges...`);
  
  const created: College[] = [];
  for (const college of collegesData) {
    const c = await prisma.college.create({
      data: {
        ...college,
        // Ensure legacy fields match new detailed fields for backward compatibility
        rating: college.careers360Rating,
        placement: college.placementPercentage,
        banner: college.banner || college.images?.[0] || "",
        image: college.image || college.images?.[1] || "",
        campusImages: college.campusImages || college.images || [],
        website: college.officialWebsite || college.website || "",
        acceptedExams: college.examsAccepted || [],
      } as Prisma.CollegeUncheckedCreateInput,
    });
    created.push(c);
  }

  console.log("Generating realistic reviews...");
  const reviewers = [
    { author: "K. Tharun Kumar", rating: 4.5, comment: "Excellent infrastructure, faculty members are very supportive. The placements are amazing, especially for CSE/IT branches." },
    { author: "Ananya Rao", rating: 4.0, comment: "Decent campus life. Labs are well-equipped. Hostel food could be improved but facilities are top tier." },
    { author: "Rahul Reddy", rating: 4.8, comment: "Outstanding research ecosystem and coding culture. Direct industry exposure through practice school and internships." },
    { author: "Pooja Hegde", rating: 4.2, comment: "Fests are great! Transport is regular and placement cell does a very thorough job preparing students." },
    { author: "Suresh Naidu", rating: 3.8, comment: "Feasible ROI if you join via convener quota. Great academic standards but attendance rules are strict." }
  ];

  for (const college of created) {
    // Add 2-3 reviews per college
    const selectedReviews = [
      reviewers[Math.floor(Math.random() * reviewers.length)],
      reviewers[(Math.floor(Math.random() * reviewers.length) + 1) % reviewers.length],
      reviewers[(Math.floor(Math.random() * reviewers.length) + 2) % reviewers.length],
    ];

    await prisma.review.createMany({
      data: selectedReviews.map(r => ({
        collegeId: college.id,
        author: r.author,
        rating: r.rating,
        comment: `${r.comment} (${college.shortName || college.name})`,
      }))
    });
  }

  console.log("Seeding QA forums...");
  await prisma.question.create({
    data: {
      title: "Which college has the best placement ROI under TS EAMCET?",
      body: "I got a 4,500 rank in TS EAMCET. Confused between CBIT CSE, VNR VJIET CSE, and Vasavi CSE. Which has better packages and coding culture?",
      author: "EamcetAspirant2026",
      answers: {
        create: [
          {
            body: "CBIT is generally the oldest and has a very strong alumni network, but VNR VJIET has been performing exceptionally well in coding placements recently, with average packages close to 8 LPA. Vasavi has strict discipline and great placements too. Go for VNR or CBIT based on travel distance!",
            author: "SeniorDeveloperHyd",
          },
          {
            body: "I am a CBIT senior. CBIT coding culture is great, and if you work hard, you can crack companies like Microsoft or Oracle which visit campus. Highly recommend CBIT!",
            author: "CbitSenior2024",
          }
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

  console.log(`Successfully seeded ${created.length} colleges, reviews, community questions, and demo user.`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
