const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();
let MONGO_URI = process.env.MONGO_URI
app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http)
app.use(express.urlencoded({extended: false}));

app.use(express.json());
app.use(express.static(__dirname))

const Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', async (req,res) => {
    let mongoData = await Message.find({})
    res.send((mongoData))
    
})

app.post('/messages', (req,res) => {
    let message = new Message(req.body)
    message.save((err) => {
        if(err) {sendStatus(500)}
    io.emit('message', req.body)
    res.sendStatus(200)
    })
})

io.on('connection', socket => {
    console.log('a user connected');
})

mongoose.connect(MONGO_URI, (err) => {
    console.log('Mongo connected', err);
})
const server = http.listen(8080, () => {
    console.log("server listening on port", server.address().port);
})


