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

app.post("/participants", async (request, response) => {

    try{

    } catch (erro) {
        response.status(500).send(erro.message)
    }
})

app.get("/participants", async (request, response) => {

    try{

    } catch (erro) {
        response.status(500).send(erro.message)
    }
})

app.post("/messages", async (request, response) => {

    try{

    } catch (erro) {
        response.status(500).send(erro.message)
    }
})

app.get("/messages", async (request, response) => {

    try{

    } catch (erro) {
        response.status(500).send(erro.message)
    }
})

app.post("/status", async (request, response) => {

    try{

    } catch (erro) {
        response.status(500).send(erro.message)
    }
})

app.listen(5000, console.log("Servidor rodando na porta 5000"))