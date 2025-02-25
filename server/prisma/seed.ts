import { PrismaClient } from "@prisma/client";
import { getEnv } from "../src/utils/generic/manage-env";
import { hashPassword } from "../src/helpers/auth.helper";
const prisma = new PrismaClient();
async function main() {
  await prisma.admin.create({
    data: {
      email: "admin@gmail.com",
      name: "Admin",
      password: await hashPassword(getEnv("ADMIN_PASSWORD")),
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
