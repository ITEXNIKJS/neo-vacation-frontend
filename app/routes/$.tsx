import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/authentication";

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   return await authenticator.isAuthenticated(request, {
//     successRedirect: "/",
//     failureRedirect: "/login",
//   });
// };
