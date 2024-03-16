import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";
const prisma = new PrismaClient();
async function main() {
  const new_user = await prisma.user.create({
    data: {
      id: "81ddf915-c3e5-4346-8b85-8141ede86c0c",
      login: "admin",
      password_hash: await hash("admin"),
      tg_id: 637382945,
      tg_username: "ewokasi",
    },
  });

  console.log(new_user);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
