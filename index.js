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
     client.connect();
    const catagoryRoboCollection = client
      .db("robogalaxy")
      .collection("catagoryrobo");
    const brandsCollection = client.db("robogalaxy").collection("brands");

    const discountCollection = client.db("robogalaxy").collection("discount");

    const allToysCollection = client.db("robogalaxy").collection("allToys");

    //all toys

    app.post("/alltoys", async (req, res) => {
      const doc = {
        category: req.body.category,
        name: req.body.name,
        price: req.body.price,
        rating: req.body.Rating,
        image: req.body.url,
        quantity: req.body.quantity,
        sellerName: req.body.seller,
        sellerEmail: req.body.email,
        details: req.body.detail,
      };
      // console.log(doc);
      const result = await allToysCollection.insertOne(doc);
      res.send(result);
    });

    app.get("/alltoys", async (req, res) => {
      const limit = parseInt(req.query.limit) || 20;
      let query = {};
      if (req.query?.category) {
        query = { category: req.query?.category };
      } else if (req.query?.email) {
        query = { sellerEmail: req.query?.email };
      }
      const result = await allToysCollection
        .find(query)
        .sort({ price: 1 })
        .limit(limit)
        .toArray();
      res.send(result);
    });

    app.get("/mytoys", async (req, res) => {
      let query = {};
      let sort = {};
      if (req.query?.sort && req.query?.email) {
        sort = { price: parseInt(req.query.sort) };
        query = { sellerEmail: req.query?.email };
      }
      const result = await allToysCollection.find(query).sort(sort).toArray();
      res.send(result);
    });

    app.get("/alltoys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await allToysCollection.findOne(filter);
      res.send(result);
    });

    app.put("/alltoys/:id", async (req, res) => {
      const id = req.params.id;
      const toy = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateToy = {
        $set: {
          price: toy.price,
          details: toy.detail,
          quantity: toy.quantity,
        },
      };
      const options = { upsert: true };
      const result = await allToysCollection.updateOne(
        filter,
        updateToy,
        options
      );
      res.send(result);
    });

    app.delete("/alltoys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await allToysCollection.deleteOne(filter);
      res.send(result);
    });

    // catagory robo

    app.get("/catagoryrobo", async (req, res) => {
      const result = await catagoryRoboCollection.find().toArray();
      res.send(result);
    });

    // brand

    app.get("/brands", async (req, res) => {
      const result = await brandsCollection.find().toArray();
      res.send(result);
    });

    // discount

    app.get("/discount", async (req, res) => {
      const result = await discountCollection.find().toArray();
      res.send(result);
    });

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
