import { ActionFunctionArgs, json } from "@remix-run/node";
import { getValidatedFormData } from "remix-hook-form";
import { authenticator } from "~/services/authentication";
import { AuthFormResolver } from "~/widgets";

export const action = async ({ request }: ActionFunctionArgs) => {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, AuthFormResolver);

  if (errors) {
    return json({ errors, defaultValues });
  }

  return await authenticator.authenticate("form", request, {
    successRedirect: "/",
    failureRedirect: "/login",
    context: { data },
  });
};
