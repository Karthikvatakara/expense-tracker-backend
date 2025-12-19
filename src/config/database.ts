import { DataSource } from 'typeorm';
import { User } from "../entities/User";
import { Expense } from  "../entities/Expense";
import * as dotenv from "dotenv";

dotenv.config();

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT || '5433'),
//   username: process.env.DB_USERNAME || 'postgres',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_DATABASE || 'expense_tracker_test',
// //   synchronize: true,
//   entities: [User, Expense],
// });

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [User, Expense],
  synchronize: false,
});
