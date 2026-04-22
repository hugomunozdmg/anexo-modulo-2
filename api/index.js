let express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const PORT = 3000;
const uri = "mongodb://admin:admin123@127.0.0.1:27017";

const { MongoClient } = require("mongodb");
let db;

async function start() {
  try {
    const client = await MongoClient.connect(uri);
    db = client.db("test");
    console.log("Connected to MongoDB");

    app.listen(3000, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Mongo error:", err);
  }
}

start();

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/data", (req, res) => {
  let data1 = req.query.data1;

  res.send({ data: data1 });
});

app.post("/post-data", (req, res) => {
  let data = req.body.data;
  db.collection("users").insertOne({ data: data });
  
  res.send({ data });
});
