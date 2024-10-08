const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.knlt5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    const database = client.db("woodify");
    const craftCollection = database.collection("craftItems");
    const userCollection = database.collection("userData");

    app.get("/craftData", async (req, res) => {
      const craftData = craftCollection.find();
      const result = await craftData.toArray();
      res.send(result);
    });

    app.get("/craftData/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });

    app.get("/userData", async (req, res) => {
      const usrData = userCollection.find();
      const result = await usrData.toArray();
      res.send(result);
    });

    app.post("/userData", async (req, res) => {
      const userData = req.body;
      const result = await userCollection.insertOne(userData);
      res.send(result);
    });

    app.post("/craftData", async (req, res) => {
      const craftData = req.body;
      const result = await craftCollection.insertOne(craftData);
      res.send(result);
    });

    app.put("/craftData/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCraft = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          userName: updatedCraft.userName,
          email: updatedCraft.email,
          craft_name: updatedCraft.craft_name,
          image: updatedCraft.image,
          category: updatedCraft.category,
          shortDescription: updatedCraft.shortDescription,
          Price: updatedCraft.Price,
          rating: updatedCraft.rating,
          customization: updatedCraft.customization,
          processing_time: updatedCraft.processing_time,
          StockStatus: updatedCraft.StockStatus,
          creatorEmail: updatedCraft.creatorEmail,
        },
      };

      const result = await craftCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.delete("/craftData/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    });

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
  res.send("Hello from woodify server");
});

app.listen(port, () => {
  console.log(`server is listening at port ${port}`);
});
