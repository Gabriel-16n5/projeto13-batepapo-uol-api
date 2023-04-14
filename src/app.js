import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

const mongoCLient = new MongoClient(process.env.DATABASE_URL)
    try{
        await mongoCLient.connect()
        console.log("conexão com db feita")
    }catch (erro) {
        console.log(erro.message)
    }
const db = mongoCLient.db();

app.listen(5000, console.log("Servidor rodando na porta 5000"))