let express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

dotenv.config()
const PORT = 3000 || process.env.PORT
const uri = `mongodb://admin:${process.env.PASSWORD}@127.0.0.1:27017`;

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

//----------------
const users = [];

app.post("/registrar-usuario", (req, res) => {
  let data = req.body;
  let registered = checkUserExist(users, data);
  let message = "";

  if (!registered) {
    users.push(data);
    message = "register success";
  } else {
    message = "an account already exist with this email";
  }

  res.send({ user: data, message: message, status: 200 });
});

app.get("/usuarios", (req, res) => {
  res.send(users);
});

app.get("/datos-usuario", (req, res) => {
  let email = req.query.email;
  let message = "";
  let exist = checkUserExist(users, { email: email });
  message = exist ? "user exist" : "user doesnt exist";

  res.send({ message: message });
});

function checkUserExist(users, user) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].email == user.email) {
      return true;
    }
  }
  return false;
}
