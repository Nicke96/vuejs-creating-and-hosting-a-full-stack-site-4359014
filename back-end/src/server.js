import express, { application } from "express";
import { MongoClient } from "mongodb";
import path from "path";
const mongoDbConnectionString = process.env.MONGODB_CONNECT;

async function start() {
  const url = mongoDbConnectionString;
  const client = new MongoClient(url);

  await client.connect();
  const db = client.db("fsv-db");

  const app = express();

  app.use(express.json());

  app.use("/images", express.static(path.join(__dirname, "../assets")));

  app.use(
    express.static(path.resolve(__dirname, "../dist"), {
      maxAge: "1y",
      etag: false,
    })
  );

  app.get("/api/products", async (req, res) => {
    const products = await db.collection("products").find({}).toArray();
    res.send(products);
  });

  async function populatedCartIds(ids) {
    return Promise.all(
      ids.map((id) => db.collection("products").findOne({ id }))
    );
  }

  app.get("/api/users/:userId/cart", async (req, res) => {
    const user = await db
      .collection("users")
      .findOne({ id: req.params.userId });
    const populatedCart = await populatedCartIds(user?.cartItems || []);
    res.json(populatedCart);
  });

  app.get("/api/products/:productId", async (req, res) => {
    const product = await db
      .collection("products")
      .findOne({ id: req.params.productId });
    res.json(product);
  });

  app.post("/api/users/:userId/cart", async (req, res) => {
    const userId = req.params.userId;
    const productId = req.body.id;

    const existingUser = await db.collection("users").findOne({ id: userId });

    if (!existingUser) {
      await db.collection("users").insertOne({ id: userId, carItems: [] });
    }

    await db
      .collection("users")
      .updateOne({ id: userId }, { $addToSet: { cartItems: productId } });

    const user = await db
      .collection("users")
      .findOne({ id: req.params.userId });

    const populatedCart = await populatedCartIds(user?.cartItems || []);
    res.json(populatedCart);
  });

  app.delete("/api/users/:userId/cart/:productId", async (req, res) => {
    const productId = req.params.productId;
    const userId = req.params.userId;

    await db
      .collection("users")
      .updateOne({ id: userId }, { $pull: { cartItems: productId } });

    const user = await db
      .collection("users")
      .findOne({ id: req.params.userId });

    const populatedCart = await populatedCartIds(user?.cartItems || []);
    res.json(populatedCart);
  });

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });

  const port = process.env.PORT || 8000;

  app.listen(port, () => {
    console.log("Server is listening on port " + port);
  });
}

start();
