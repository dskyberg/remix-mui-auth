import * as React from 'react';

import {Form, useLoaderData, Link as RemixLink } from '@remix-run/react';
import {Link, Typography} from '@mui/material';

import { auth, sessionStorage } from "~/services/auth.server.js";

export const loader = async ({ request }) => {
  await auth.isAuthenticated(request, { successRedirect: "/private" });
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );
  const error = session.get(auth.sessionErrorKey);
  return json({ error });
};

export const meta = () => [
  { title: 'Remix Starter' },
  { name: 'description', content: 'Welcome to remix!' },
];


export default function Index() {
    const { error } = useLoaderData();

  return (
    <React.Fragment>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Material UI Remix example
      </Typography>
          <Form method="post" action="/auth/github">
      {error ? <div>{error.message}</div> : null}
      <Button>Sign In with GitHub</Button>
    </Form>

      <Link to="/about" color="secondary" component={RemixLink}>
        Go to the about page
      </Link>
    </React.Fragment>
  );
}
