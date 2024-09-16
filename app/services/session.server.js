import { createCookieSessionStorage } from "@remix-run/node";

if (!process.env.SESSION_SECRET) {
	throw new Error("SESSION_SECRET is required");
}

const cookie = {
	name: "__session",
	httpOnly: true,
	path: "/",
	sameSite: "lax",
	secrets: [process.env.SESSION_SECRET], // This should be an env variable
	secure: process.env.NODE_ENV === "production",
};

export const sessionStorage = createCookieSessionStorage(cookie);
