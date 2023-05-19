const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bs8dc9c.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const catagoryRoboCollection = client
      .db("robogalaxy")
      .collection("catagoryrobo");
    const brandsCollection = client.db('robogalaxy').collection('brands')

    const discountCollection = client.db('robogalaxy').collection('discount')

    const allToysCollection = client.db('robogalaxy').collection('allToys')

    //all toys

    app.get('/alltoys',async(req,res)=>{
      const limit = parseInt(req.query.limit) || 20;
      const result = await allToysCollection.find().limit(limit).toArray()
      res.send(result)
    })
    app.get('/alltoys/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await allToysCollection.findOne(query);
      res.send(result)
    })
    
    // catagory robo
    
    app.get("/catagoryrobo", async (req, res) => {
      let query = {};
      if (req.query?.category) {
          query = { category : req.query?.category };
      }
      const result = await catagoryRoboCollection.find(query).toArray();
      res.send(result);
    });

    // brand 

    app.get('/brands',async(req,res)=>{
      const result = await brandsCollection.find().toArray()
      res.send(result)
    })

    // discount
    
    app.get('/discount',async(req,res)=>{
      const result = await discountCollection.find().toArray()
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("toy galaxy server is running");
});

app.listen(port, () => {
  console.log(`toy galaxy server is running on port : ${port}`);
});
