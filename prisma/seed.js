import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";
const prisma = new PrismaClient();
async function main() {
  await prisma.user.create({
    data: {
      login: "admin",
      password_hash: await hash("admin"),
      tg_id: 637382945,
      tg_username: "ewokasi",
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
  });
