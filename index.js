const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.SER_USER}:${process.env.SER_PASS}@cluster0.sbt8k6o.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const coffeeCollection = client.db('coffeeDB').collection("coffee")
        app.get('/coffees', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.findOne(query)
            res.send(result)
        })


        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;

            const result = await coffeeCollection.insertOne(newCoffee)
            res.send(result)
        })
        app.put('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedCoffee=req.body;
            const Coffee = {
                $set: {
                    name: updatedCoffee.name,
                    chef: updatedCoffee.chef,
                    category: updatedCoffee.category,
                    details: updatedCoffee.details,
                    supplier: updatedCoffee.supplier,
                    taste: updatedCoffee.taste,
                    Photo: updatedCoffee.Photo,
                    price: updatedCoffee.price,
                }
            }
            const result =await coffeeCollection.updateOne(filter,Coffee,options)
            res.send(result)
        })

        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query)
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('coffee server')
})
app.listen(port, () => {
    console.log('nodemon running');
})