const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4ko6w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(express.json());
app.use(cors());

const port = 5000

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  
  app.post('/addProduct', (req, res) => {
    const products = req.body;
    // console.log(product)
    productsCollection.insertMany(products)
    .then(result => {
      res.send(result.insertedCount)
      console.log(result.insertedCount);
    })
  })
  app.get('/products', (req, res)=>{
    productsCollection.find({})
    .toArray( (err, documents)=>{
      res.send(documents)
    })
  })

  app.get('/product/:key', (req, res)=>{
    productsCollection.find({key: req.params.key})
    .toArray( (err, documents)=>{
      res.send(documents[0])
    })
  })

  app.post('/productsByKeys', (req, res)=>{
    const productKeys = req.body;
    productsCollection.find({key: {$in: productKeys}})
    .toArray( (err, documents) =>{
      res.send(documents);
    })
  })

  app.post('/addProduct', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

});

app.get('/', (req, res) => {
  res.send('Hello ema john shop')
})

app.listen(process.env.PORT || port)