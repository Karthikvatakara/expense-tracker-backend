import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import cookieParser from 'cookie-parser'
dotenv.config();
import authRouter from "./routes/auth.routes";

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials:true
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",authRouter)


app.use((req, res) => {
    res.status(404).json({ message: "route not found "});
})


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