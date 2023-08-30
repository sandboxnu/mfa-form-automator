# MFA Form Automator

## Tech Stack

NextJS, NestJS, Prisma, PostgreSQL

## Getting Started (Local Development)

1. Create a .env file in the project root and configure environment variables using the example.
2. Install dependencies in both `apps/web` and `apps/server`. We currently use Yarn as our package manager.
3. Generate the Prisma Client in the `apps/server` directory using the following command from within the `apps/server` directory:

    ```bash
    yarn prisma generate
    ```

4. To run the development client and server together:

    ```bash
    yarn dev
    ```

    The client should be hosted at [http://localhost:3000](http://localhost:3000).

    The server should be hosted at [http://localhost:4000](http://localhost:4000).

TODO: Database setup and initialization using Prisma Migrate.

## Regenerating Client

When making changes to our backend, we need to regenerate our frontend client to allow us to access the updated endpoints.

1. Start instance of backend server hosted at [http://localhost:4000](http://localhost:4000) by running the following command in the server directory:

    ```bash
    yarn start:dev
    ```

2. In the client directory, run the following command:

    ```bash
    yarn gen-client
    ```

    The client should be regenerated based on the running local backend instance.
