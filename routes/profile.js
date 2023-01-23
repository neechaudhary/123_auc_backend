const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");


router.post("/", (req, res) => {
    const db = admin.firestore();
    const profileCollection = db.collection("profile");

    //Add new profile to the collection
    profileCollection.add({
        name: req.body.name,
        description: req.body.description,
        createdAt: new Date().toISOString(),
    });

    //Send response
    res.status(200).send({
        message: "Profile added successfully",
    });
});

//Read all profiles
router.get("/", async (req, res) => {
    const db = admin.firestore();
    const profileCollection = db.collection("profile");
    const profile = await profileCollection.get();
    const profileArray = [];
    profile.forEach((doc) => {
        profileArray.push({
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            createdAt: doc.data().createdAt,
        });
    });
    res.status(200).send(profileArray);
});

//Read a profile
router.get("/:id", async (req, res) => {
    const db = admin.firestore();
    const profileCollection = db.collection("profile");
    const profile = await profileCollection.doc(req.params.id).get();
    if (!profile.exists) {
        res.status(404).send({
            message: "Profile not found",
        });
    } else {
        res.status(200).send({
            id: profile.id,
            name: profile.data().name,
            description: profile.data().description,
            createdAt: profile.data().createdAt,
        });
    }
});

//Update a profile
router.put("/:id", async (req, res) => {
    const db = admin.firestore();
    const profileCollection = db.collection("profile");
    const profile = await profileCollection.doc(req.params.id).get();
    if (!profile.exists) {
        res.status(404).send({
            message: "Profile not found",
        });
    } else {
        await profileCollection.doc(req.params.id).update({
            name: req.body.name,
            description: req.body.description,
        });
        res.status(200).send({
            message: "Profile updated successfully",
        });
    }
});

//Delete a profile
router.delete("/:id", async (req, res) => {
    const db = admin.firestore();
    const profileCollection = db.collection("profile");
    const profile = await profileCollection.doc(req.params.id).get();
    if (!profile.exists) {
        res.status(404).send({
            message: "Profile not found",
        });
    } else {
        await profileCollection.doc(req.params.id).delete();
        res.status(200).send({
            message: "Profile deleted successfully",
        });
    }
});


module.exports = router;