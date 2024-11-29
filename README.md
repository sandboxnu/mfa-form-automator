# MFA Form Automator

## Tech Stack

NextJS, NestJS, Prisma, PostgreSQL

## Overview of Yarn Commands

- `dev`: start the frontend and backend (hot reloading)
- `format`: run prettier formatter
- `lint`: run eslint
- `test`: run all tests
- `tsc`: run ts checker
- `migrate`: run prisma migrate and make changes to local db in `apps/server`
- `gen-client`: regenerate client used to communicate with backend in `apps/web`
- `dev:db:up`: start up the database in `apps`
- `dev:db:down`: stop the database in `apps`
- `backend:docker:build`: build the docker image for the backend in `apps`
- `backend:docker:run`: start the backend and database stack in `apps`
- `backend:docker:down`: stop the backend and database stack in `apps`
- `prisma db seed`: run database seed script in `apps/server`

## Getting Started (Local Development)

1. Create a .env file in `apps/web` and `apps/server` and configure environment variables using the provided example files.

   `apps/server/.env`
   | VARIABLE | VALUE |
   |--------------------|---------------------------------------------------------------------------------------------------------------------------------|
   | DOMAIN | <http://localhost> |
   | BACKEND_PORT | 8080 |
   | SALT_ROUNDS | 10 |
   | DATABASE_URL | postgresql://user:pass@localhost:5432/db?schema=public |
   | JWT_SECRET | Execute the following to generate a random secret key: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" |
   | JWT_VALID_DURATION | 600 |
   | JWT_REFRESH_VALID_DURATION | 604800 |
   | FRONTEND_DOMAIN | <http://localhost:3002> |
   | POSTMARK_SERVER_KEY | |
   | NODE_ENV | development |

   `apps/web/.env`
   | VARIABLE | VALUE |
   |--------------------|---------------------------------------------------------------------------------------------------------------------------------|
   | FRONTEND_PORT | 3000 |
   | AZURE_AD_CLIENT_ID | |
   | AZURE_AD_CLIENT_SECRET | |
   | AZURE_AD_TENANT_ID | |
   | BLOB_READ_WRITE_TOKEN | |
   | NEXTAUTH_SECRET | |
   | NEXTAUTH_URL | http://localhost:3002 |

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
   yarn backend:docker:run
   yarn dev:db:up
   ```

5. Migrate your local database using Prisma Migrate in order to set up database schemas.

   ```bash
   yarn migrate
   ```

6. Run the frontend and backend locally. The environment variables should be configured to use our local stack:

   ```bash
   yarn dev
   ```

   The client should be hosted at [http://localhost:3000](http://localhost:3000).

   The server should be hosted at [http://localhost:8080](http://localhost:8080).

   We utilize a reverse proxy hosted at [http://localhost:3002](http://localhost:3002) to allow for CORS/Access Control. To interact with the frontend, visit [http://localhost:3002](http://localhost:3002). All backend traffic will also be directed to [http://localhost:3002](http://localhost:3002), and the proxy forwards traffic accordingly. Backend traffic is differentiated by a `/api` in the url.

7. The database should be located at [http://localhost:5432](http://localhost:5432). pgadmin is accessible from [http://localhost:5050](http://localhost:5050), and the credentials are `admin@admin.com:pgadmin4`. To connect to the database using pgadmin, create a new server connection with the host set to `host.docker.internal`, port set to `5432`, and username and password set to `user` and `pass` respectively.

## Regenerating Client

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

## Database Seeding

Run the database seeding script (seed.ts) to initially populate the database.

1. Start docker container and backend database in `apps`

   ```bash
   yarn backend:docker:run
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
