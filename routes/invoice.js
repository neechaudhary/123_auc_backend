const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.post("/", (req, res) => {
  const db = admin.firestore();
  const invoiceCollection = db.collection("invoice");

  //create random invoice id
  const invoiceid =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  //calculate total amount
  const quantity = req.body.quantity;
  const price = req.body.price;
  const gst = price * quantity * (18 / 100);
  const amount = price * quantity + gst;

  const ress = invoiceCollection.add({
    invoiceid: invoiceid,
    date: req.body.date,
    place_of_supply: req.body.place_of_supply,
    iname: req.body.iname,
    quantity: req.body.quantity,
    price: req.body.price,
    gst: gst,
    amount: amount,
  });

  res.status(200).send({
    message: "invoice delievered"
  });

})
//read a invoice
router.get("/:id", async (req, res) => {
  const db = admin.firestore();
  const invoiceCollection = db.collection("invoice");

  //check if user exist
  const user_exist = await invoiceCollection.doc(req.params.id).get();
  if (!user_exist.exists) {
    res.send(400).send({
      message: "please check the user",
    });
  } else {
    res.status(200).send({
      invoiceid: user_exist.id,
      date: user_exist.data().date,
      place_of_supply: user_exist.data().place_of_supply,
      iname: user_exist.data().iname,
      quantity: user_exist.data().quantity,
      price: user_exist.data().price,
      gst: user_exist.data().gst,
      amount: user_exist.data().amount,
    });
  }
});
//delete
router.delete("/:id", async (req, res) => {
  const db = admin.firestore();
  const invoiceCollection = db.collection("invoice");
  const invoice = await invoiceCollection.doc(req.params.id).get();
  if (!invoice.exists) {
    res.status(404).send({
      message: "Please check your id",
    });
  } else {
    await invoiceCollection.doc(req.params.id).delete();
    res.status(200).send({
      message: "user been deleted successfully",
    });
  }
});

//update invoice
router.put("/:id", async (req, res) => {
  const db = admin.firestore();
  const invoiceCollection = db.collection("invoice")

  //if user exist or not
  const invoice = await invoiceCollection.doc(req.params.id).get();
  if (!invoice.exists) {
    res.status(400).send({
      message: " user not available"
    })
  } else {
    await invoiceCollection.doc(req.params.id).update({
      date: req.body.date,
      place_of_supply: req.body.place_of_supply,
      iname: req.body.iname,
      quantity: req.body.quantity,
      price: req.body.price
    })

    //send response
    res.status(200).send({
      message: "Your invoice has been successfully updated"
    })
  }

})

module.exports = router;
