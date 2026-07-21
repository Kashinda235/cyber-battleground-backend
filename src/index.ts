import dotenv from 'dotenv';
import { app } from './app.js';

dotenv.config();

const port = Number(process.env.PORT) || 8000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
