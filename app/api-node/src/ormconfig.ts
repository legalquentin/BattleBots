import { ConnectionOptions } from 'typeorm';
 
const config: ConnectionOptions = {
  type: 'postgres',
  host: "localhost",
  port: 5432,
  username: "root",
  password: "p@ssw0rd",
  database: "db",
  entities: [
    __dirname + '/../**/*.entity{.ts,.js}',
  ],
  cli: {
    migrationsDir: './src/migration',
  }
};
 
export = config;