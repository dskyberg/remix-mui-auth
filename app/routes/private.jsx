import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import {Button} from '@mui/material';

import { auth } from "~/services/auth.server";

export const action = async ({ request }) => {
  await auth.logout(request, { redirectTo: "/" });
};

export const loader = async ({ request }) => {
  const { profile } = await auth.isAuthenticated(request, {
    failureRedirect: "/",
  });

  return json({ profile });
};

export default function Screen() {
  const { profile } = useLoaderData();
  return (
    <>
      <Form method="post">
        <Button>Log Out</Button>
      </Form>

      <hr />

      <pre>
        <code>{JSON.stringify(profile, null, 2)}</code>
      </pre>
    </>
  );
}