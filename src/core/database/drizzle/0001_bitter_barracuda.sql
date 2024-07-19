ALTER TABLE "api_keys" ADD COLUMN "user_email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_email_unique" UNIQUE("user_email");