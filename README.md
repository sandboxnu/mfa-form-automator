# MFA Form Automator

## Tech Stack

NextJS, NestJS, Prisma, PostgreSQL

## Getting Started (Local Development)

1. Create a .env file in the project root and configure environment variables using the example.
2. Install dependencies in both `apps/client` and `apps/server`. We currently use Yarn as our package manager.
3. Generate the Prisma Client in the `apps/server` directory using the following command from within the `apps/server` directory:

    ```bash
    yarn prisma generate
    ```

4. To run the development client and server:

    ```bash
    yarn dev
    ```

    The client should be hosted at [http://localhost:3000](http://localhost:3000).

    The server should be hosted at [http://localhost:4000](http://localhost:4000).
