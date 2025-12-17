import expres from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import cookieParser from 'cookie-parser'
dotenv.config();

const app = expres();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials:true
}

app.use(cors(corsOptions));
app.use(cookieParser());

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.error('Error during database initialization:', error);
    process.exit(1);
  });

  app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    });