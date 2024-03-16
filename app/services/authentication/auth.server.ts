import { prisma } from "../db";
import * as argon2 from "argon2";
import { sessionStorage } from "./session.server";
import { redirect } from "@remix-run/node";

const login = async (login: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      login,
    },
    select: {
      id: true,
      password_hash: true,
    },
  });

  if (!user) return { error: "Неверный логин или пароль" };

  const isPasswordMatch = argon2.verify(user.password_hash, password);

  if (!isPasswordMatch) return { error: "Неверный логин или пароль" };

  return { user_id: user.id, error: null };
};

interface CheckAuthURLS {
  successRedirect?: string;
  failerRedirect?: string;
}

const check_auth = async (request: Request, url?: CheckAuthURLS) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  if (!session.data.user_id) {
    session.flash("error", "Invalid username/password");
    if (url?.failerRedirect) {
      return redirect(url?.failerRedirect, {
        headers: {
          "Set-Cookie": await sessionStorage.destroySession(session),
        },
      });
    }
    return null;
  }

  if (url?.successRedirect) return redirect(url?.successRedirect);

  return session.data.user_id;
};

export { login, check_auth };
