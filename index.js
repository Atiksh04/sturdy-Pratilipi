import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import {routes} from './routes/route'
import socketIO from 'socket.io'
import http from 'http'
import {socketFunctions} from './controllers/controller'
import path from 'path'
const app=express()
mongoose.Promise= global.Promise;
mongoose.connect('mongodb+srv://rootadmin:kalash22@mongo.c7r3k.mongodb.net/pratilipi_assignment?retryWrites=true&w=majority')
app.use(express.static(path.join(__dirname,'/build')))

app.use(express.json())
app.use(cors())
routes(app)

app.get('*',(req,res)=>{
	res.sendFile(path.join(__dirname+'/build/index.html'))
})


const server=http.createServer(app)

const io = socketIO(server)

socketFunctions(io)
server.listen(process.env.PORT||3001,()=>console.log('server started @3001'))
