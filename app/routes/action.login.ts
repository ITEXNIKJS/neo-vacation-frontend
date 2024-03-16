import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { getValidatedFormData } from "remix-hook-form";
import { login, sessionStorage } from "~/services/authentication";
import { AuthFormResolver } from "~/widgets";

export const action = async ({ request }: ActionFunctionArgs) => {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData(request, AuthFormResolver);

  if (errors) {
    return json({ errors, defaultValues });
  }

  const response = await login(data.login as string, data.password as string);

  if (response.error) return json({ errors, defaultValues });

  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  session.set("user_id", response.user_id);

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};
