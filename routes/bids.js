const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.post("/", validation, (req, res) => {
    const db = admin.firestore();
    const bidsCollection = db.collection("bids");

    //Add new bid to the collection 

    bidsCollection.add({
        name: req.body.name,
        description: req.body.description,
        createdAt: new Date().toISOString()
    })

    //Send response
    res.status(200).send({
        message: "Bid added successfully"

    });
});

//Read all bids
router.get("/", async (req, res) => {
    const db = admin.firestore();
    const bidsCollection = db.collection("bids");
    const bids = await bidsCollection.get();
    const bidsArray = [];
    bids.forEach((doc) => {
        bidsArray.push({
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            createdAt: doc.data().createdAt,
        });
    });
    res.status(200).send(bidsArray);
});

//Read a bid
router.get("/:id", async (req, res) => {
    const db = admin.firestore();
    const bidsCollection = db.collection("bids");
    const bid = await bidsCollection.doc(req.params.id).get();
    if (!bid.exists) {
        res.status(404).send({
            message: "Bid not found",
        });
    } else {
        res.status(200).send({
            id: bid.id,
            name: bid.data().name,
            description: bid.data().description,
            createdAt: bid.data().createdAt,
        });
    }
});

//Update a bid
router.put("/:id", async (req, res) => {
    const db = admin.firestore();
    const bidsCollection = db.collection("bids");
    const bid = await bidsCollection.doc(req.params.id).get();
    if (!bid.exists) {
        res.status(404).send({
            message: "Bid not found",
        });
    } else {
        await bidsCollection.doc(req.params.id).update({
            name: req.body.name,
            description: req.body.description,
        });
        res.status(200).send({
            message: "Bid updated successfully",
        });
    }
});

//Delete a bid
router.delete("/:id", async (req, res) => {
    const db = admin.firestore();
    const bidsCollection = db.collection("bids");
    const bid = await bidsCollection.doc(req.params.id).get();
    if (!bid.exists) {
        res.status(404).send({
            message: "Bid not found",
        });
    } else {
        await bidsCollection.doc(req.params.id).delete();
        res.status(200).send({
            message: "Bid deleted successfully",
        });
    }
});


async function validation(req, res, next) {

    const db = admin.firestore();
    const loginCollection = db.collection("bids")
    //check name
    const name = await loginCollection.where("name", "==", req.body.name).get();
    if (!name.empty) {
        res.status(400).send({
            message: "plesase enter correct name"
        })
    }

    //check description
    const description = await loginCollection.where("description", "==", req.body.description).get();
    if (!description.empty) {
        res.status(400).send({
            message: "plesase enter correct name"
        })
    }
    next();
}

module.exports = router;