const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.post("/", (req, res) => {
    const db = admin.firestore();
    const offersCollection = db.collection("offers");


    const userId =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

    //calculating offer price
    const actualPrice = req.body.actualPrice;
    const oPercent = req.body.oPercent;
    const discount = actualPrice * (oPercent / 100);
    const discounted_price = actualPrice - discount;

    //Add new bid to the collection 
    offersCollection.add({
        userId: userId,
        offeritems: req.body.offeritems,
        actualPrice: req.body.actualPrice,
        oPercent: req.body.oPercent,
        discount: discount,
        discounted_price: discounted_price,
        offerDescription: req.body.offerDescription,
        offerPrice: discounted_price,
        createdAt: new Date().toISOString(),
    });

    //Send response
    res.status(200).send({
        message: "Your offer has been added",

    });
});
//Read all bids
router.get("/", async (req, res) => {
    const db = admin.firestore();
    const offersCollection = db.collection("offers");
    const offers = await offersCollection.get();
    const offersArray = [];
    offers.forEach((doc) => {
        offersArray.push({
            id: doc.id,
            actualPrice: doc.data().actualPrice,
            offeritems: doc.data().offeritems,
            oPercent: doc.data().oPercent,
            offerDescription: doc.data().offerDescription,
            offerPrice: doc.data().offerPrice,
            discount: doc.data().discount,
            discounted_price: doc.data().discounted_price,
            createdAt: doc.data().createdAt,
        });
    });
    res.status(200).send(offersArray);
});


//Update a bid
router.put("/:id", async (req, res) => {
    const db = admin.firestore();
    const offersCollection = db.collection("offers");
    const offers = await offersCollection.doc(req.params.id).get();
    if (!offers.exists) {
        res.status(404).send({
            message: "Offer not available",
        });
    } else {
        await offersCollection.doc(req.params.id).update({
            actualPrice: req.body.actualPrice,
            offeritems: req.body.offeritems,
            oPercent: req.body.oPercent,
            offerDescription: req.body.offerDescription,

        });
        res.status(200).send({
            message: "Your offer has been updated",
        });
    }
});



//Delete a bid
router.delete("/:id", async (req, res) => {
    const db = admin.firestore();
    const offersCollection = db.collection("offers");
    const offers = await offersCollection.doc(req.params.id).get();
    if (!offers.exists) {
        res.status(404).send({
            message: "Please check the id",
        });
    } else {
        await offersCollection.doc(req.params.id).delete();
        res.status(200).send({
            message: "Offer delted successfully",
        });
    }
});


async function Validation(req, res, next) {

    const db = admin.firestore();
    const commissionCollection = db.collection("commission")

    const snapshot = await commissionCollection.get("offers");
    const list = snapshot.docs.map((doc) => ({
        quantity: doc.data().quantity

    }));







    next();
}


module.exports = router;