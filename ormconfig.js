const type = process.env.TYPEORM_TYPE || 'postgres';
const username = process.env.TYPEORM_USERNAME || 'postgres';
const password = process.env.TYPEORM_PASSWORD || 'postgres';
const host = process.env.TYPEORM_HOST || 'localhost';
const port = parseInt(process.env.TYPEORM_PORT, 10) || 5432;
const database = process.env.TYPEORM_DATABASE || 'test';

module.exports = {
  type,
  url:
    process.env.DATABASE_URL ||
    `${type}://${username}:${password}@${host}:${port}/${database}`,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: false,
  ssl: process.env.NODE_ENV === 'development' ? false : true,
  extra:
    process.env.NODE_ENV === 'development'
      ? {}
      : {
          ssl: {
            rejectUnauthorized: false,
          },
        },
};
