const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5300
require('dotenv').config()


app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.yhrwxpk.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){

    try{
        const servicesCollection = client.db('sports-lance').collection('services-collection')

        app.get('/', async(req, res)=>{
            const query = {}
            const cursor = servicesCollection.find(query)
            const result = await cursor.limit(3).toArray()
            res.send(result)
        })


        app.get('/services', async(req, res)=>{
            const query = {}
            const cursor = servicesCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })


    }

    finally{

    }
}

run() .catch(err => console.log(err))

app.get('/', (req, res)=>{
    res.send('server side developed')
})

app.listen(port, ()=>{
    console.log('server running at port 5000')
})

