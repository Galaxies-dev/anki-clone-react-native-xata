import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const { PORT } = process.env;

const app = express();
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
