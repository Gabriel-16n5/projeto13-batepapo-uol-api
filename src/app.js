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

//
    let userHolder;
//
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
    const {to ,text ,type} = request.body;
    const {user} = request.headers;

    const userValidation = await db.collection("participants").findOne({name: user});
    if(!userValidation) return response.status(422).send("validação do user");
    if(!type) return response.status(422).send("type obrigatório");
    const typeValidation = type.includes("message");
    if(!typeValidation) return response.status(422).send("validação do type");
    const messageSchema = joi.object({
        to: joi.string().required(),
        text: joi.string().required(),
        type: type
    })
    const validation = messageSchema.validate(request.body, {abortEarly: false});
    if(validation.error) return response.status(422).send("validação do body");

    const userMessage = {
        from: user,
        to: to,
        text: text,
        type: type,
        time: dayjs().format('HH:mm:ss')
    }

    try{
        const holder = await db.collection("messages").insertOne(userMessage);
        response.sendStatus(201)
    } catch (erro) {
        response.status(500).send(erro.message)
    }
})

app.get("/messages", async (request, response) => {
    const limit = parseInt(request.query.limit);
    if(limit <= 0) return response.status(422).send("validação do limit"); // falta validar string não númerica
    if(isNaN(limit)) return response.status(422).send("validação do limit");
    console.log(limit)
    const {user} = request.headers;
    const userValidation = await db.collection("participants").findOne({name: user});
    if(!userValidation) return response.status(422).send("validação do user");

    try{
        if(!limit){
        const listMenssages = await db.collection("messages").find( 
            { $or: [  { to: "Todos" } , { from: user }, { to: user } ] } 
            ).toArray();
        return response.send(listMenssages);
    }
        const listMenssages = await db.collection("messages").find( 
            { $or: [  { to: "Todos" } , { from: user }, { to: user } ] } 
            ).toArray();
        return response.send(listMenssages.slice(-limit));
    } catch (erro) {
        response.status(500).send(erro.message)
    }
})

app.post("/status", async (request, response) => {
    const {user} = request.headers;
    String(user)
    userHolder = user
    console.log(userHolder)
    try{
        if(!user) return response.status(404).send("validação do user");
        const participant = await db.collection("participants").findOne({name: user});
        console.log(participant)
        if(!participant) return response.status(404).send("validação no banco");
        const newTime = {
            lastStatus: Date.now()
        }
        const updateuser = await db.collection("participants").updateOne(
                {name: user},
                {$set: newTime}
        )
        console.log(updateuser)
        response.sendStatus(200);
    } catch (erro) {
        response.status(500).send(erro.message)
        console.log(erro.message)
    }
})

    async function removeParticipants(){
        
        try{
            let time = Date.now()
            const deletedUser = await db.collection("participants").deleteMany(
            { lastStatus: { $lte: (time-10000) } }
        );
        console.log(deletedUser)
        if(deletedUser.deletedCount === 0) return;
        const userExiting = { 
            from: userHolder,
            to: 'Todos',
            text: 'sai da sala...',
            type: 'status',
            time: dayjs().format('HH:mm:ss')
        }
        const exitUser = await db.collection("messages").insertOne(userExiting)
        return;
     } catch (erro) {
            console.log(erro.message)
     }
    }

    setInterval(removeParticipants, 15000);

app.listen(5000, console.log("Servidor rodando na porta 5000"))