export const config = () => ({
    port: Number(process.env.PORT) || 3000,
    isDev: process.env.NODE_ENV === "development",
    migrations: Boolean(process.env.RUN_MIGRATIONS),
    database: {
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        synchronize: process.env.NODE_ENV === "development",
        logging: false,
        entities: ['dist/**/*.entity{.ts,.js}'],
    }
});