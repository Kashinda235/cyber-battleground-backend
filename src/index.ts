import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 8000;

// Middleware
app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello from TypeScript Express server!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
