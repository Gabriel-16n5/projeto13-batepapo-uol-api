import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();


app.listen(5000, console.log("Servidor rodando na porta 5000"))