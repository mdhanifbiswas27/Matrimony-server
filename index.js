const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jwbcngj.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();


    const userCollection = client.db("assigment-twelveDb").collection("user");
    const reviewCollection = client.db("assigment-twelveDb").collection("review");
    const biodataCollection = client.db("assigment-twelveDb").collection("biodata");

    // get all premium user
    app.get('/user', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })
    // get all bio data
    app.get('/biodata', async (req, res) => {
      const result = await biodataCollection.find().toArray();
      res.send(result);
    })
    // get bio data by id
    app.get('/biodata/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await biodataCollection.find(query).toArray();
      res.send(result);
    })
    
    // biodata item get by email
    app.get('/biodata', async(req, res)=>{
      const email = req.query.email;
      const query = { email : email};
      const result = await biodataCollection.find(query).toArray();
      res.send(result);
    })


    // add single biodata
    app.post('/biodata', async (req, res) => {
      try {
        
        const biodata = req.body;
        const existingUser = await userCollection.findOne({ email: biodata.email });
        if (existingUser) {
          return res.status(409).json({ message: 'User already exists' });
        }
        const result = await biodataCollection.insertOne(biodata);
        res.status(201).json({ message: 'Biodata added successfully', insertedDocument: result.ops[0] });
      } catch (error) {
        console.error( error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    // delete a biodata by id
    app.delete('/biodata/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
       const result = await biodataCollection.deleteOne(query);
       res.send(result);
    })

    // get all review
    app.get('/review', async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    })

    // get a single user
    app.get('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.find(query).toArray();
      res.send(result);
    })
    // add single review to review collection
    app.post('/review', async (req, res) => {
      const reviewItem = req.body;
      const result = await reviewCollection.insertOne(reviewItem);
      res.send(result);
    })
    // update a biodata
    app.put('/biodata/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateBioData = req.body;
      const bioData = {
        $set: {
          BiodataType: form.updateBioData.value,
          ProfileImage: updateBioData.ProfileImage,
          dateofbirth: updateBioData.dateofbirth,
          height: updateBioData.height,
          occupation: updateBioData.occupation,
          fatherName: updateBioData.fatherName,
          motherName: updateBioData.motherName,
          division: updateBioData.division,
          partnerWeight: updateBioData.partnerWeight,
          partnerAge: updateBioData.partnerAge,
          phone: updateBioData.phone,
          email: updateBioData.email,
        }
      }
      const result = await biodataCollection.updateOne(filter, bioData, options);
      res.send(result);
    })
      
    // ----------------------------------------------------------------
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
  res.send('assignment is running')
})

app.listen(port, () => {
  console.log(`assignment twelve is running on port ${port}`);
})