import type { LoaderFunctionArgs } from "@remix-run/node";
import { check_auth } from "~/services/authentication";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await check_auth(request, {
    failerRedirect: "/login",
    successRedirect: "/",
  });
};
