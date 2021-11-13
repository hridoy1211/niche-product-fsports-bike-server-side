const express = require('express');
require("dotenv").config();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kwpis.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("FSPORT_Bike");
      const bikesCollection = database.collection("bikes");
      const ordersCollection = database.collection("orders");
      const reviewsCollection = database.collection("reviews");
      const usersCollection = database.collection("users");
      
      
      // POST API for Add Bikes
      app.post('/addProducts', async(req, res) => {
          const result = await bikesCollection.insertOne(req.body);
          res.json(result)
      })
      // GET API for Display Bikes
      app.get('/allProducts', async(req, res) => {
          const result = await bikesCollection.find({}).toArray();
          res.json(result)
      })
      // GET API for Display Single Bike
      app.get('/singlePoduct/:id', async(req, res) => {
        const id = req.params.id  
        const query ={_id:ObjectId(id)}
        const singleProduct = await bikesCollection.findOne(query);
        res.json(singleProduct);
      })




      // POST API for order's data store to database
      app.post('/addMyOrders', async(req,res) => {
        const result = await ordersCollection.insertOne(req.body);
        console.log(result);
        res.json(result)
      })
      // GET API for MyOrder
      app.get('/myOrder/:email', async(req,res) => {
        const email = req.params.email;
        console.log(email);
        const query = {email:email}
        const result = await ordersCollection.find(query).toArray();
        res.json(result)
      })
      // DELETE API for deleting orders
      app.delete('/deletedOrder/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const deletedOrder = await ordersCollection.deleteOne(query);
        console.log(deletedOrder);
        res.json(deletedOrder);
      })


      // POST API for set review
      app.post('/addReview', async(req,res) => {
        const result = await reviewsCollection.insertOne(req.body);
        console.log(result);
        res.json(result)
      })
      // GET API for display review
      app.get('/displayReviews', async(req,res) => {
        const result = await reviewsCollection.find({}).toArray();;
        console.log(result);
        res.json(result)
      })


      // Register User Info
      app.post('/addUserInfo', async(req, res)=>{
        const query = req.body;
        const result = await usersCollection.insertOne(query);
        console.log(result);
      })


      // Make Admin 
      app.put('/makeAdmin', async(req, res)=> {
        const filter = {email: req.body.email}
        const result = await usersCollection.find(filter).toArray();
        
        if(result){
          const updateAdmin = await usersCollection.updateOne(filter,{
            $set: { role: "admin" },
          })
        }
      })
      // check admin
      app.get('/checkAdmin/:email', async(req, res) => {
        const result = await usersCollection.find({email: req.params.email}).toArray()
        res.json(result)
      })


      // MAnage Products
      app.delete('/deleteProduct/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const deleteProduct = await bikesCollection.deleteOne(query);
        console.log(deleteProduct);
        res.json(deleteProduct);
      })

      // All Orders Manage Products
      app.get('/manageOrder', async(req, res)=>{
        const result = await ordersCollection.find({}).toArray();
        res.json(result)
      })


      // Status Update from Order list
      app.put('/statusUpdate/:id', async(req, res) => {
        const id = {_id: ObjectId(req.params.id)};
        const result = await ordersCollection.updateOne(id,{
          $set: {
            status: req.body.status
          }
        })
        res.json(result);

      })

      // Delete all Order 
      app.delete('/deleteOrders/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const deleteOrders = await ordersCollection.deleteOne(query);
        console.log(deleteOrders);
        res.json(deleteOrders);
      })


    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Welcome to FSPORT!')
})

app.listen(port, () => {
  console.log(`Running port at http://localhost:${port}`)
})