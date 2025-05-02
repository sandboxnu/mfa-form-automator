# MFA Form Automator

[![Deploy - Frontend CD - Azure App Service](https://github.com/sandboxnu/mfa-form-automator/actions/workflows/main_mfa-forms-frontend.yml/badge.svg?branch=main)](https://github.com/sandboxnu/mfa-form-automator/actions/workflows/main_mfa-forms-frontend.yml)
[![Deploy - Backend CD - Azure App Service](https://github.com/sandboxnu/mfa-form-automator/actions/workflows/main_mfa-forms-backend.yml/badge.svg?branch=main)](https://github.com/sandboxnu/mfa-form-automator/actions/workflows/main_mfa-forms-backend.yml)

## Tech Stack

NextJS, NestJS, Prisma, PostgreSQL

This project uses the Chakra UI component library.

## Overview of Yarn Commands

These commands should be run from the workspace root.

Example:
`yarn dev`

- `dev`: start the frontend, backend, and proxy for local development (supports hot reloading)
  - This command does not work well on Windows machines. If running on Windows, you will need to start each component independently. Using three separate terminal windows, run the following commands from the workspace root to start the frontend, backend, and local dev proxy, respectively:
    - `yarn --cwd apps/web dev`
    - `yarn --cwd apps/server start:dev`
    - `node apps/proxy.ts`
- `format`: run prettier formatter to format code
- `lint`: run eslint to check for linting errors
- `test`: run all tests
- `tsc`: run ts checker
- `openapi-ts`: regenerate client used to communicate with backend in `apps/web` (ensure local dev setup is running beforehand)
- `dev:db:up`: start up the database in `apps`
- `dev:db:down`: stop the database in `apps`
- `backend:docker:build`: build the docker image for the backend in `apps`
- `backend:docker:run`: start the backend and database stack in `apps`
- `backend:docker:down`: stop the backend and database stack in `apps`
- `db seed`: run database seed script in `apps/server`
- `prisma generate`: generate the prisma client in `apps/server`
- `migrate`: run prisma migrate and make changes to local db in `apps/server` (ensure server .env variables point to your local db instance)

## Getting Started (Local Development)

Run all commands from the workspace root, unless otherwise specified.

1. Create a .env file in `apps/web` and `apps/server` and configure environment variables using the provided example files.

`apps/server/.env`
| VARIABLE | VALUE |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------|
| DOMAIN | <http://localhost> |
| BACKEND_PORT | 8080 |
| SALT_ROUNDS | 10 |
| DATABASE_URL | postgresql://user:pass@localhost:5432/db?schema=public |
| DIRECT_URL | postgresql://user:pass@localhost:5432/db?schema=public |
| JWT_SECRET | Execute the following to generate a random secret key: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" |
| JWT_REFRESH_SECRET | Execute the following to generate a random secret key: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" |
| JWT_VALID_DURATION | 600 |
| JWT_REFRESH_VALID_DURATION | 604800 |
| FRONTEND_DOMAIN | <http://localhost:3002> |
| POSTMARK_SERVER_KEY | |
| BLOB_READ_WRITE_TOKEN | (only necessary if using Vercel blob storage) |
| AZURE_STORAGE_CONNECTION_STRING | Reference connection string from Azure |
| USE_VERCEL_BLOB_STORAGE | (defaults to false if not set, only set to true if using Vercel blob storage) |
| NODE_ENV | development |

`apps/web/.env`
| VARIABLE | VALUE |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------|
| NEXT_PUBLIC_AZURE_CLIENT_ID | (reference Azure AD values) |
| NEXT_PUBLIC_AZURE_REDIRECT_URI | http://localhost:3002 (should only be configured if using sandbox Azure account with redirect uri configured to point to localhost) |
| NEXT_PUBLIC_AZURE_TENANT_ID | (reference Azure AD values) |
| API_URL | http://localhost:8080 |

2. Install yarn dependencies. We currently use Yarn and Yarn workspaces to manage dependencies.

   ```bash
   yarn install
   ```

3. Generate the Prisma Client in the `apps/server` directory using the following command from within the `apps/server` directory:

   ```bash
   yarn prisma generate
   ```

4. Start up your local database in `apps` directory:

   ```bash
   yarn dev:db:up
   ```

5. Migrate your local database using Prisma Migrate in order to set up database schemas.

   ```bash
   yarn prisma migrate
   ```

6. Run the frontend and backend locally, with a proxy. The environment variables should be configured to use our local stack (if using Windows, refer to alternate commands above):

   ```bash
   yarn dev
   ```

   The client should be hosted at [http://localhost:3000](http://localhost:3000).

   The server should be hosted at [http://localhost:8080](http://localhost:8080).

   We utilize a reverse proxy hosted at [http://localhost:3002](http://localhost:3002) to allow for CORS/Access Control. To interact with the frontend, visit [http://localhost:3002](http://localhost:3002). All backend traffic will also be directed to [http://localhost:3002](http://localhost:3002), and the proxy forwards traffic accordingly. Backend traffic is differentiated by a `/api` in the url.

7. The database should be located at [http://localhost:5432](http://localhost:5432). pgadmin is accessible from [http://localhost:5050](http://localhost:5050), and the credentials are `admin@admin.com:pgadmin4`. To connect to the database using pgadmin, create a new server connection with the host set to `host.docker.internal`, port set to `5432`, and username and password set to `user` and `pass` respectively.

## Generated Frontend Client and Regenerating the Frontend Client

This project uses a library called Hey-Api to generate frontend clients for us to use based on the OpenAPI spec generated by our NestJS server implementation. This allows us to avoid having to write custom frontend clients to interact with our backend and to have consistent types and interactions with our backend. This library also generates react-query clients, which simplify data fetching significantly and allow us to take advantage of caching, data refetching, and pagination. Whenever entities, DTOs, or other types change in our backend, we must regenerate the client so the frontend is able to communicate with the backend.

When making changes to our backend, we need to regenerate our frontend client to allow us to access the updated endpoints.

1. Start instance of backend server hosted at [http://localhost:8080](http://localhost:8080) by running the following command in the server directory:

   ```bash
   yarn dev
   ```

2. Run the following command:

   ```bash
   yarn gen-client
   ```

   The client should be regenerated based on the running local backend instance.

## Database and Database Seeding

### Prisma

This project utilizes the Prisma ORM for interacting with our database. In the `apps/server` directory, there is a `prisma` directory containing our database schema, as well as historical migrations that have been made to our schema. The schema file contains details about our schema and also comments detailing how the different tables interact with each other and what they represent to end users.

When making changes to the database schema, you will need to create a migration. Refer to the Prisma migration documents [here](https://www.prisma.io/docs/orm/prisma-migrate/getting-started) for more information on migrations.

### Seeding

Run the database seeding script (seed.ts) to initially populate the database.

1. Start docker container and backend database in `apps`

   ```bash
   yarn dev:db:up
   ```

2. Generate the Prisma Client in the `apps/server` directory using the following command from within the `apps/server` directory:

   ```bash
   yarn prisma generate
   ```

3. To reset existing migrations and run the seeding script, run the following command in `apps/server`:

   ```bash
   yarn prisma migrate reset
   ```

4. To run the seeding script and leave existing migrations, run the following command in `apps/server`:

   ```bash
   yarn prisma db seed
   ```

## CI/CD Overview

This project is configured to use Github Actions for CI/CD. In the pipeline, we run checks to make sure that new changes are formatted, linted, pass tests, and successfully build new frontend and backend images. If configured with Azure, new merges to the main branch will trigger new images to be built, saved in Azure container registries, and deployed to Azure App Service instances.

## Test Coverage

This project makes use of many integration tests to ensure consistent functionality of our backend. There are some unit tests that currently exist, but they do not cover the majority of code. As of May 1, 2025, there is almost complete test coverage of all backend services, but limited/no coverage of backend controllers and other associated components. There are also no frontend unit tests, but they are highly recommended to help prevent regressions with new development work.
