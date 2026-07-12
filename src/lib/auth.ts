import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

const getBaseURL = () => {
    if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
    if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "http://localhost:3000";
};

const baseURL = getBaseURL();

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        }
    }),
    baseURL: baseURL,
    trustedOrigins: [
        baseURL,
        "http://localhost:3000",
        process.env.NEXT_PUBLIC_APP_URL,
        process.env.BETTER_AUTH_URL,
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    ].filter(Boolean) as string[],
    onRequest: async (request: Request) => {
        console.log(`Auth Request: ${request.method} ${request.url}`);
    },
    emailAndPassword: {
        enabled: true
    },
    user: {
        additionalFields: {
            bio: {
                type: "string",
                required: false,
            },
            preferredLevel: {
                type: "string",
                required: false,
            },
            isApproved: {
                type: "boolean",
                required: false,
                defaultValue: true,
            },
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
            }
        }
    }
});
