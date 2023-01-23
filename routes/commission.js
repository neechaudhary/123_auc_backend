const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

//genetate random userid
const userid =
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

router.post("/", (req, res) => {
  const db = admin.firestore();
  const commissionCollection = db.collection("commission");

  //calculate commission
  const amount = req.body.amount;
  const percent = req.body.percent;
  const commPercent = amount * (percent / 100)

  //Add new commission to the collection
  commissionCollection.add({
    userid: userid,
    name: req.body.name,
    city: req.body.city, //have to build logic to calculate commission,its incomplete
    amount: req.body.amount,
    cPercent: req.body.cPercent,
    Commission: commPercent, //logic need to apply here
    createdAt: new Date().toISOString(),
  });

  //Send response
  res.status(200).send({
    message: "commission successfully added",
  });
});

//Read all bids
router.get("/", async (req, res) => {
  const db = admin.firestore();
  const commissionCollection = db.collection("commission");
  const commission = await commissionCollection.get();
  const commissionArray = [];
  commission.forEach((doc) => {
    commissionArray.push({
      userid: doc.id,
      name: doc.data().name,
      city: doc.data().city,
      amount: doc.data().amount,
      cPercent: doc.data().cPercent,
      Commission: doc.data().Commission, //logic need to apply here
      createdAt: doc.data().createdAt,
    });
  });
  res.status(200).send(commissionArray);
});

//Update a bid
router.put("/:id", async (req, res) => {
  const db = admin.firestore();
  const commissionCollection = db.collection("commission");
  const commission = await commissionCollection.doc(req.params.id).get();
  if (!commission.exists) {
    res.status(404).send({
      message: "user not found",
    });
  } else {
    await commissionCollection.doc(req.params.id).update({
      name: req.body.name,
      city: req.body.city,
      cPercent: req.body.cPercent,
      amount: req.body.amount
    });
    res.status(200).send({
      message: "commisssion updated successfully",
    });
  }
});

//Delete a bid
router.delete("/:id", async (req, res) => {
  const db = admin.firestore();
  const commissionCollection = db.collection("commission");
  const commission = await commissionCollection.doc(req.params.id).get();
  if (!commission.exists) {
    res.status(404).send({
      message: "user not found",
    });
  } else {
    await commissionCollection.doc(req.params.id).delete();
    res.status(200).send({
      message: "commissioned user deleted successfully",
    });
  }
});

async function Validation(req, res, next) {

  const db = admin.firestore();
  const commissionCollection = db.collection("commission")


  const commission = await commissionCollection.where("")


  next();
}

module.exports = router;
