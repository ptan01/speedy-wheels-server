const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8hd0j1r.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
        // await client.connect();

        const toysCollection = client.db('toysDB').collection('toys') ;



        app.get('/toys', async(req, res)=>{
           const result = await toysCollection.find().limit(20).toArray()
           res.send(result)
        })

        app.get('/toys/:text', async(req, res)=>{
            const text = req.params.text;
            const result = await toysCollection.find({$or: [ { name: { $regex: text, $options: "i" } }]}).toArray()
            res.send(result)
        })

        app.get('/single-toys/:id', async(req, res)=> {
            const id = req.params.id ;
            const query = {_id : new ObjectId(id)}
            const result = await toysCollection.findOne(query)
            res.send(result)
        })


        app.get('/user-toys', async(req, res)=> {
            const email = req.query.email ;
            const sorting = req.query.sort ;
            const query = {email : email}
            const result = await toysCollection.find(query).sort('price', parseInt(sorting)).toArray()
            res.send(result)
            console.log(parseInt(sorting))
        })

        app.get('/category/off-road', async (req, res)=> {
            const query = { category: 'Off-Road Vehicles' }
            const result = await toysCollection.find(query).limit(6).toArray()
            res.send(result)
        })

        app.get('/category/electric', async(req, res)=> {
            const query = {category : 'Electric Vehicles'}
            const result = await toysCollection.find(query).limit(6).toArray()
            res.send(result)
        })

        app.get('/category/sports', async(req, res)=> {
            const query = {category: 'Sports Cars'}
            const result = await toysCollection.find(query).limit(6).toArray()
            res.send(result)
        })

        app.patch('/toys/update/:id', async(req, res)=>{
            const id = req.params.id ;
            const filter = {_id : new ObjectId(id)}
            const toy = req.body ;
            const updateToy = {
                      $set:{
                        price : toy.price,
                        quantity: toy.quantity,
                        description: toy.description
                      }
                    }
            const result = await toysCollection.updateOne(filter, updateToy)
            res.send(result)

        })

        app.post('/toys', async(req, res)=> {
            const toy = req.body ;
            const result = await toysCollection.insertOne(toy)
            res.send(result)
            console.log(req.body)
        })

        app.delete('/toys/delete/:id', async(req, res)=> {
            const id = req.params.id ;
            const query = {_id : new ObjectId(id)}
            const result = await toysCollection.deleteOne(query)
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
    res.send('SPEEDY WHEELS SERVER IS RUNNING')
})


app.listen(port, () => {
    console.log('speedy wheels is running on port', port)
})








// app.patch('/bookings/:id', async(req, res)=>{
//     const id = req.params.id ;
//     const filter = {_id : new ObjectId(id)}
//     const booking = req.body ;
//     console.log(booking)
//     const updateBooking = {
//       $set:{
//         status : booking.status
//       }
//     }
//     const result = await bookingsCollection.updateOne(filter,updateBooking)
//     res.send(result)
// })