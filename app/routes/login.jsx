// app/routes/login.tsx
import {Button} from '@mui/material';
import {Form} from '@remix-run/react';

export default function Login() {
  return (
    <Form action="/auth/github" method="post">
      <Button>Login with GitHub</Button>
    </Form>
  );
}