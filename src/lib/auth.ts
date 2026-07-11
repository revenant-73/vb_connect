import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

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
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
    onRequest: async (request) => {
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
