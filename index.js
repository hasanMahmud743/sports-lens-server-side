const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5300
require('dotenv').config()


app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID } = require('bson')
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.yhrwxpk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){

    try{
        const servicesCollection = client.db('sports-lance').collection('services-collection')
        const reviewCollection = client.db('sports-lance').collection('review-collection')

        app.get('/', async(req, res)=>{
            let query = {}
            const cursor = servicesCollection.find(query)
            const result = await cursor.limit(3).toArray()
            res.send(result)
        })

        app.post('/services', async(req, res)=>{
            const review = req.body
            const result = reviewCollection.insertOne(review)
            res.send(result)
        })

        app.get('/review', async(req, res)=>{
            let query = {}

            if(req.query.title){
                query={
                    title: req.query.title
                }
            }

            if(req.query.email){
                query={
                    email: req.query.email
                }
            }
            console.log(req.query.email)
            const cursor = reviewCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })


        app.get('/services', async(req, res)=>{
            const query = {}
            const cursor = servicesCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/services/:id', async (req, res)=>{
            const id = req.params.id
            const query = {_id: ObjectID(id)}
            const cursor = await servicesCollection.findOne(query)
            res.send(cursor)
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

