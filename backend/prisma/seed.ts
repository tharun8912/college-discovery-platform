import { PrismaClient, Prisma, type College } from "@prisma/client";
import bcrypt from "bcrypt";
import { collegeMedia as m } from "./data/collegeMedia";
import type { CollegeSeed } from "./collegeSeed";

const prisma = new PrismaClient();

const colleges: CollegeSeed[] = [
  {
    slug: "vnrvjiet-hyderabad",
    name: "VNR Vignana Jyothi Institute of Engineering & Technology",
    location: "Hyderabad",
    fees: 140000,
    rating: 4.5,
    placement: 92,
    featured: true,
    ...m.vnrVjiet,
    website: "https://www.vnrvjiet.ac.in",
    description:
      "Autonomous institute in Hyderabad known for industry partnerships, innovation labs, and strong placement support in IT and core engineering.",
    courses: ["CSE", "ECE", "IT", "Mechanical", "Civil"],
    recruiters: ["Microsoft", "Amazon", "Google", "TCS", "Infosys"],
    ranking: 18,
    acceptedExams: ["EAMCET", "JEE Main"],
    cutoffRank: 15000,
  },
  {
    slug: "cbit-hyderabad",
    name: "Chaitanya Bharathi Institute of Technology",
    location: "Hyderabad",
    fees: 130000,
    rating: 4.3,
    placement: 88,
    featured: true,
    ...m.cbit,
    website: "https://www.cbit.ac.in",
    description:
      "One of Hyderabad's premier private engineering colleges with active research, alumni network, and consistent recruiter visits.",
    courses: ["CSE", "ECE", "EEE", "Mechanical", "MBA"],
    recruiters: ["Deloitte", "Capgemini", "Wipro", "TCS", "Cognizant"],
    ranking: 28,
    acceptedExams: ["EAMCET", "JEE Main"],
    cutoffRank: 18000,
  },
  {
    slug: "iiit-hyderabad",
    name: "IIIT Hyderabad",
    location: "Hyderabad",
    fees: 350000,
    rating: 4.9,
    placement: 98,
    featured: true,
    ...m.iiitHyderabad,
    website: "https://www.iiit.ac.in",
    description:
      "Top research university focused on computer science with exceptional placements in product, research, and global tech firms.",
    courses: ["CSE", "ECE", "CSD", "CLD"],
    recruiters: ["Google", "Microsoft", "Amazon", "Adobe", "Goldman Sachs"],
    ranking: 3,
    acceptedExams: ["JEE Main", "UGEE"],
    cutoffRank: 2500,
  },
  {
    slug: "bits-hyderabad",
    name: "BITS Pilani – Hyderabad Campus",
    location: "Hyderabad",
    fees: 420000,
    rating: 4.8,
    placement: 96,
    featured: true,
    ...m.bitsHyderabad,
    website: "https://www.bits-pilani.ac.in",
    description:
      "Elite campus with flexible academics, entrepreneurship culture, and strong global recruiter presence.",
    courses: ["CSE", "ECE", "EEE", "Mechanical"],
    recruiters: ["Google", "Microsoft", "Amazon", "Uber", "Flipkart"],
    ranking: 8,
    acceptedExams: ["BITSAT", "JEE Main"],
    cutoffRank: 5000,
  },
  {
    slug: "mgit-hyderabad",
    name: "Mahatma Gandhi Institute of Technology",
    location: "Hyderabad",
    fees: 110000,
    rating: 4.1,
    placement: 80,
    featured: false,
    ...m.mgit,
    website: "https://www.mgit.ac.in",
    description:
      "Affordable engineering education with practical labs, workshops, and regional hiring partnerships.",
    courses: ["CSE", "IT", "ECE", "Civil"],
    recruiters: ["Wipro", "Tech Mahindra", "HCL", "TCS"],
    ranking: 95,
    acceptedExams: ["EAMCET"],
    cutoffRank: 35000,
  },
  {
    slug: "vasavi-hyderabad",
    name: "Vasavi College of Engineering",
    location: "Hyderabad",
    fees: 95000,
    rating: 4.0,
    placement: 78,
    featured: false,
    ...m.vasavi,
    website: "https://www.vce.ac.in",
    description:
      "Autonomous college offering value-focused B.Tech programs with steady placements in IT services and product companies.",
    courses: ["CSE", "IT", "ECE", "Mechanical"],
    recruiters: ["Infosys", "TCS", "Wipro", "HCL"],
    ranking: 110,
    acceptedExams: ["EAMCET"],
    cutoffRank: 40000,
  },
  {
    slug: "andhra-university-vizag",
    name: "Andhra University College of Engineering",
    location: "Visakhapatnam",
    fees: 85000,
    rating: 4.0,
    placement: 75,
    featured: false,
    ...m.andhraUniversity,
    website: "https://www.andhrauniversity.edu.in",
    description:
      "Historic state university college with affordable fees and strong regional employer connections.",
    courses: ["CSE", "ECE", "Civil", "Mechanical"],
    recruiters: ["BHEL", "NTPC", "TCS", "Infosys"],
    ranking: 125,
    acceptedExams: ["EAMCET", "AP POLYCET"],
    cutoffRank: 55000,
  },
  {
    slug: "gitam-vizag",
    name: "GITAM Deemed to be University",
    location: "Visakhapatnam",
    fees: 165000,
    rating: 4.1,
    placement: 82,
    featured: false,
    ...m.gitam,
    website: "https://www.gitam.edu",
    description:
      "Multi-campus university with industry-aligned curriculum and international academic collaborations.",
    courses: ["CSE", "Data Science", "ECE", "Architecture"],
    recruiters: ["Deloitte", "Accenture", "Capgemini", "IBM"],
    ranking: 72,
    acceptedExams: ["GITAM GAT", "JEE Main"],
    cutoffRank: 42000,
  },
  {
    slug: "srm-ap-amaravati",
    name: "SRM University AP – Amaravati",
    location: "Amaravati",
    fees: 180000,
    rating: 4.2,
    placement: 85,
    featured: true,
    logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/SRM_University_logo.png",
    banner: "https://upload.wikimedia.org/wikipedia/commons/3/3f/SRM_University%2C_Amaravati.jpg",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3f/SRM_University%2C_Amaravati.jpg",
    campusImages: [],
    website: "https://srmap.edu.in",
    description:
      "Modern residential campus with interdisciplinary programs and growing national recruiter network.",
    courses: ["CSE", "AI & ML", "ECE", "Mechanical", "BBA"],
    recruiters: ["Amazon", "Microsoft", "Cognizant", "Infosys", "TCS"],
    ranking: 42,
    acceptedExams: ["SRMJEEE", "JEE Main"],
    cutoffRank: 45000,
  },
  {
    slug: "kl-university-vijayawada",
    name: "KL University",
    location: "Vijayawada",
    fees: 155000,
    rating: 4.2,
    placement: 84,
    featured: false,
    logo: "https://upload.wikimedia.org/wikipedia/en/9/9e/KL_University_logo.png",
    banner: "https://upload.wikimedia.org/wikipedia/commons/a/a1/KL_University_campus.jpg",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a1/KL_University_campus.jpg",
    campusImages: [],
    website: "https://www.kluniversity.in",
    description:
      "Innovation-driven deemed university with incubation support and expanding placement ecosystem.",
    courses: ["CSE", "AI & DS", "ECE", "Mechanical"],
    recruiters: ["TCS", "Infosys", "Wipro", "Capgemini"],
    ranking: 58,
    acceptedExams: ["KLUEEE", "JEE Main"],
    cutoffRank: 38000,
  },
];

async function main() {
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.review.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.savedComparison.deleteMany();
  await prisma.college.deleteMany();

  const created: College[] = [];
  for (const college of colleges) {
    const c = await prisma.college.create({
      data: college as Prisma.CollegeUncheckedCreateInput,
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

  console.log(`Seeded ${created.length} colleges with official Wikimedia images`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
