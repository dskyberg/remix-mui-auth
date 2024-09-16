import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";
import { sessionStorage } from "~/services/session.server";

if (!process.env.GITHUB_CLIENT_ID) {
	throw new Error("GITHUB_CLIENT_ID is required");
}

if (!process.env.GITHUB_CLIENT_SECRET) {
	throw new Error("GITHUB_CLIENT_SECRET is required");
}

if (!process.env.BASE_URL) {
	throw new Error("BASE_URL is required");
}

const BASE_URL = process.env.BASE_URL;

export const auth = new Authenticator(sessionStorage);

auth.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: new URL("/auth/github/callback", BASE_URL).toString(),
		},
		async ({ profile, accessToken, extraParams }) => {
			return { profile, accessToken, extraParams };
		},
	),
);
