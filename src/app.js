import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import joi from "joi";
import dayjs from 'dayjs'
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
    const {name} = request.body;

    const participantsSchema = joi.object({
        name: joi.string().required()
    })

    const validation = participantsSchema.validate(request.body, {abortEarly: false});

    if(validation.error) return response.sendStatus(422);

    try{
        const ValidateUser = await db.collection("participants").findOne({name: name})
        if(ValidateUser) return response.sendStatus(409);
        const validUser = {
            name: name,
            lastStatus: Date.now()
        }
        const holderUser = await db.collection("participants").insertOne(validUser);
        const mensagem = { 
            from: name,
            to: 'Todos',
            text: 'entra na sala...',
            type: 'status',
            time: dayjs(validUser.lastStatus).format('HH:mm:ss')
    }
        const holderMsg = await db.collection("messages").insertOne(mensagem);
        response.sendStatus(201);
    } catch (erro) {
        response.status(500).send(erro.message)
    }
})

app.get("/participants", async (request, response) => {

    try{
        const listParticipants = await db.collection("participants").find().toArray();
        response.send(listParticipants);
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