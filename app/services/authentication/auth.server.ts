import { Authenticator } from "remix-auth";
import { User } from "@prisma/client";
import { prisma } from "../db";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import * as argon2 from "argon2";

const authenticator = new Authenticator<Pick<User, "login">>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    // console.log(context);

    const login = form.get("login") as string;
    const password = form.get("password") as string;

    const user = await prisma.user.findUnique({
      where: {
        login,
      },
      select: {
        login: true,
        password_hash: true,
      },
    });

    if (!user) throw Error("user not exists");

    const isPasswordMatch = argon2.verify(user.password_hash, password);

    if (!isPasswordMatch) throw Error("Password not match");

    return { login: user.login };
  })
);

export { authenticator };
