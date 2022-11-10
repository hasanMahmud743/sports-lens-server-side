const express = require('express')
var jwt = require('jsonwebtoken');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5300
require('dotenv').config()


app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID } = require('bson')
const { response } = require('express')
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.yhrwxpk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const verifiedJWT = (req, res, next)=>{
    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.status(401).send({message: 'unauthorized access'})
    }

  

    const token  = authHeader.split(' ')[1]
    console.log(token)

    jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded){
        if(err){
            return  res.status(401).send({message: 'unauthorized access'})
        }
        req.decoded = decoded
        next()

    })
}



async function run(){

    try{
        const servicesCollection = client.db('sports-lance').collection('services-collection')
        const reviewCollection = client.db('sports-lance').collection('review-collection')

        app.get('/', async(req, res)=>{
            let query = {}
            const cursor = servicesCollection.find(query).sort({time: -1})
            const result = await cursor.limit(3).toArray()
            res.send(result)
        })

        app.post('/review', async(req, res)=>{
            const review = req.body
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })


        app.post('/jwt',  (req, res)=>{
            const user = req.body
            const token =  jwt.sign(user, process.env.TOKEN_SECRET, {expiresIn: '1h'})
            res.send({token})
            // console.log(token, user)
        })

        app.post('/services', async(req, res)=>{
            const review = req.body
            const result = await servicesCollection.insertOne(review)
            res.send(result)
        })


        app.get('/review', verifiedJWT,  async(req, res)=>{

            const decoded = req.decoded
            console.log(decoded.email, req.query.email)

           

            if(decoded.email !== req.query.email){
                console.log('wrong ')
                return res.status(401).send({message: 'unauthorized access'})

            }

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
            console.log(req.query.title, req.query.email)
            const cursor = reviewCollection.find(query).sort({time: -1})
            const result = await cursor.toArray()
            res.send(result)
        })

        app.delete('/review/:id', async (req, res)=>{
            const id = req.params.id
            const query = {_id: ObjectID(id)}
            const result = await reviewCollection.deleteOne(query)
            res.send(result)

        })


        app.get('/services', async(req, res)=>{
            const query = {}
            const cursor = servicesCollection.find(query).sort({time: -1})
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/services/:id', async (req, res)=>{
            const id = req.params.id
            const query = {_id: ObjectID(id)}
            const cursor = await servicesCollection.findOne(query)
            res.send(cursor)
        })


        app.patch('/review/:id',   async(req, res)=>{
            const id = req.params.id
            const text = req.body.text
            const query = {_id: ObjectID(id)}
            const updatedDoc = {
                $set:{
                   text : text,
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc)
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

