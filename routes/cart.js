const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.get("/", async (req, res) => {
  const db = admin.firestore();
  const usersCollection = db.collection("cart");

  try {
    const response = await usersCollection.get();
    const users = response.docs.map((doc) => doc.data());
    res.send(users);
  } catch (error) {
    res.send(error);
  }
});

//Create cart
router.post("/", async (req, res) => {
  const db = admin.firestore();
  const usersCollection = db.collection("cart");

  //Generate random user id
  const userId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  //Insert a new document into the collection
  usersCollection.doc(userId).set({
    cartId: userId,
    cartName: req.body.cartName,
    cartPrice: req.body.cartPrice,
    cartImage: req.body.cartImage,
    cartQuantity: req.body.cartQuantity,
    cartCreatedAt: new Date().toISOString(),
  });

  //Send response
  res.status(200).send({
    message: "Cart created successfully",
  });
});

//update blog
router.put("/:id", async (req, res) => {
  const db = admin.firestore();
  const cartcollection = db.collection("cart")

  //if user exist or not
  const user_exist = await cartcollection.doc(req.params.id).get();
  if (!user_exist.exists) {
    res.status(400).send({
      message: " item not available"
    })
  } else {
    await cartcollection.doc(req.params.id).update({
      cartName: req.body.cartName,
      cartPrice: req.body.cartPrice,
      cartImage: req.body.cartImage,
      cartQuantity: req.body.cartQuantity
    })

    //send response
    res.status(200).send({
      message: "Your cart has been successfully updated"
    })
  }

})

//read a cart
router.get("/:id", async (req, res) => {
  const db = admin.firestore();
  const cartcollection = db.collection("cart")

  //check if user exist
  const user = await cartcollection.doc(req.params.id).get();
  if (!user.exists) {
    res.status(400).send({
      message: "user not found"
    })
  } else {
    res.status(200).send({
      cardId: user.id,
      cartName: user.data().cartName,
      cartPrice: user.data().cartPrice,
      cartImage: user.data().cartImage,
      cartQuantity: user.data().cartQuantity
    })
  }
})

//delete
router.delete("/:id", async (req, res) => {
  const db = admin.firestore();
  const cartCollection = db.collection("cart");
  const cart = await cartCollection.doc(req.params.id).get();
  if (!cart.exists) {
    res.status(404).send({
      message: "Please check your id",
    });
  } else {
    await cartCollection.doc(req.params.id).delete();
    res.status(200).send({
      message: "user been deleted successfully",
    });
  }
});

module.exports = router;
