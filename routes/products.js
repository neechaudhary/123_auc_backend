const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");
const slugify = require("slugify");

const db = admin.firestore();
const productsCollection = db.collection("products");

//read data
router.get("/", async (req, res) => {
  try {
    const response = await productsCollection.get();
    const products = response.docs.map((doc) => doc.data());
    res.send(products);
  } catch (error) {
    res.send(error);
  }
});

//Read a category
router.get("/:id", async (req, res) => {
  const db = admin.firestore();
  const productsCollection = db.collection("products");
  const products = await productsCollection.doc(req.params.id).get();
  if (!products.exists) {
    res.status(404).send({
      message: "Category not found",
    });
  } else {
    res.status(200).send({
      id: products.id,
      points: products.data().points,
      description: products.data().description,
      createdAt: products.data().createdAt,
    });
  }
});

//create data
router.post("/", (req, res) => {
  const db = admin.firestore();
  const usersCollection = db.collection("products");

  //Generate slug with filter and replace spaces with dashes
  const slug = slugify(req.body.title, {
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    lower: true,
  });

  //Generate Random product id
  const productId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  //Generate Random number for SKU
  const sku = Math.floor(Math.random() * 1000000);

  //Insert a new document into the collection
  usersCollection.doc(productId).set({
    id: productId,
    title: req.body.title,
    slug: slug,
    description: req.body.description,
    price: req.body.price,
    sale_price: req.body.sale_price,
    image: req.body.image,
    vendor: req.body.vendor,
    status: req.body.status,
    sku: sku,
    category: req.body.category,
    type: req.body.type,
    featured: req.body.featured,
    language: req.body.language,
    createdAt: new Date().toISOString(),
  });

  //Send response
  res.status(200).send({
    message: "Product registered successfully",
  });
});

//Delete a product
// router.delete("/:id", async (req, res) => {
//   try {
//     const response = await productsCollection.doc(req.params.id).delete();
//     res.send("Product deleted successfully");
//   } catch (error) {
//     res.send(error);
//   }
// });

router.delete("/:id", async (req, res) => {
  const db = admin.firestore();
  const productsCollection = db.collection("products");
  const products = await productsCollection.doc(req.params.id).get();
  if (!products.exists) {
    res.status(404).send({
      message: "Please check your id",
    });
  } else {
    await productsCollection.doc(req.params.id).delete();
    res.status(200).send({
      message: "user been deleted successfully",
    });
  }
});


module.exports = router;
