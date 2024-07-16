const express = require('express');
const app = express();
const cors= require('cors');
const bcrypt = require('bcryptjs')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port=process.env.PORT||5000;
//middlware
//Must remove "/" from your production URL
app.use( cors())
app.use(express.json());

// 
// 
console.log(process.env.DB_USER)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qmgfwvr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const userCollection = client.db("jobtaskDB").collection("users");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    app.post('/register',async(req,res)=>{
        const {name,email,number,password,role}= req.body;
        const existingUser=await userCollection.findOne({email});
        if(existingUser){
            return  res.status(400).send({ message: 'Email already exists. Please use a different email.' });
        }
        // Hash the password  PIN
        const hashedPin =await bcrypt.hash(password,10);
        const user={
            name,
            email,
            number,
            password:hashedPin,
            role,
            status:"pending"
        }
        

        const result=await userCollection.insertOne(user);
        res.send(result);
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


app.get('/',(req,res)=>{
    res.send('jobtask  is sitting')
  })
  app.listen(port,()=>{
    console.log(`jobtask is sitting on port:${port}`)
  });