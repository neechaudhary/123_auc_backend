const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");


//create tag
router.post("/", (req, res) => {
    const db = admin.firestore();
    const tagsCollection = db.collection("tags");

    //generate random tagid
    const tagid =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

    //Add new bid to the collection 
    tagsCollection.add({
        tagid: tagid,
        title: req.body.title,
        description: req.body.description,
        createdAt: new Date().toISOString(),
    });

    //Send response
    res.status(200).send({
        message: "Your tag has been added",

    });
});

//Read all bids
router.get("/", async (req, res) => {
    const db = admin.firestore();
    const tagsCollection = db.collection("tags");
    const tags = await tagsCollection.get();
    const tagsArray = [];
    tags.forEach((doc) => {
        tagsArray.push({
            tagid: doc.id,
            title: doc.data().title,
            description: doc.data().description,
            createdAt: doc.data().createdAt,
        });
    });
    res.status(200).send(tagsArray);
});

//read a tag
router.get("/:id", async (req, res) => {
    const db = admin.firestore();
    const tagsCollection = db.collection("tags");
    const tags = await tagsCollection.doc(req.params.id).get();
    if (!tags.exists) {
        res.status(404).send({
            message: "Support not found",
        });
    } else {
        res.status(200).send({
            id: tags.id,
            title: tags.data().title,
            description: tags.data().description,
            createdAt: tags.data().createdAt,
        });
    }
});


//Update a bid
router.put("/:id", async (req, res) => {
    const db = admin.firestore();
    const tagsCollection = db.collection("tags");
    const tags = await tagsCollection.doc(req.params.id).get();
    if (!tags.exists) {
        res.status(404).send({
            message: "tags with this id is not available",
        });
    } else {
        await tagsCollection.doc(req.params.id).update({

            title: req.body.title,
            description: req.body.description,
        });
        res.status(200).send({
            message: "Your tag has been updated",
        });
    }
});


//Delete a bid
router.delete("/:id", async (req, res) => {
    const db = admin.firestore();
    const tagsCollection = db.collection("tags");
    const tags = await tagsCollection.doc(req.params.id).get();
    if (!tags.exists) {
        res.status(404).send({
            message: "Please check your id",
        });
    } else {
        await tagsCollection.doc(req.params.id).delete();
        res.status(200).send({
            message: "Your tag has been deleted successfully",
        });
    }
});


module.exports = router;