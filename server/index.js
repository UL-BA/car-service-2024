import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();

const port = 8000;
app.listen(port, () => console.log(`server is running on port ${port}`));