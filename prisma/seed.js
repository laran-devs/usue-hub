const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: "file:./dev.db"
  })
});

const institutes = [
  "ИЭ", 
  "ИМГТ", 
  "ИЭУ", 
  "ИЭП", 
  "ИСТ", 
  "ИДО", 
  "Магистратура"
];

async function main() {
  console.log("Seeding institutes...");
  for (const name of institutes) {
    await prisma.institute.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
