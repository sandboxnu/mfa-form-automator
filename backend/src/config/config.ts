export const config = () => ({
    port: Number(process.env.PORT) || 3000,
    isDev: process.env.MODE === "DEV",
    migrations: Boolean(process.env.RUN_MIGRATIONS),
    database: {
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        synchronize: process.env.MODE === "DEV",
        logging: false,
        entities: ['dist/**/*.entity{.ts,.js}'],
    }
});