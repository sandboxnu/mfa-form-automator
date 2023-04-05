export const config = () => ({
  port: Number(process.env.PORT) || 3000,
  isDev: process.env.NODE_ENV === 'dev',
  migrations: Boolean(process.env.RUN_MIGRATIONS),
  database: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port:
      process.env.NODE_ENV === 'test'
        ? Number(process.env.POSTGRES_TEST_PORT)
        : Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database:
      process.env.NODE_ENV === 'test'
        ? process.env.POSTGRES_TEST_DB
        : process.env.POSTGRES_DB,
    synchronize:
      process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test',
    logging: false,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  },
});
