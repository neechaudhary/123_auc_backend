const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.post("/", (req, res) => {
    const db = admin.firestore();
    const pointsCollection = db.collection("points");

    //genetate random userid
    const userid =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

    //add points to the collection
    pointsCollection.add({
        userid: userid,
        points: req.body.points,
        description: req.body.description,
        createdAt: new Date().toISOString(),
    });
    res.status(200).send({
        message: "Your effort makes a lot to us",
    });
});

//update points
router.put("/:id", async (req, res) => {
    const db = admin.firestore()
    const pointsCollection = db.collection("points");

    const points = await pointsCollection.doc(req.params.id).get();
    if (!points.exists) {
        res.status(404).send({
            message: " please check the user or the user is not valid",
        })
    } else {
        await pointsCollection.doc(req.params.id).update({
            points: req.body.points,
            description: req.body.description
        })
        res.status(200).send({
            message: " points updated successfully"
        })
    }
    //   console.log(req.params.id);
});


//get all points details
router.get("/", async (req, res) => {
    const db = admin.firestore()
    const pointsCollection = db.collection("points")

    const points = await pointsCollection.get();
    const pointsArray = [];
    points.forEach((doc) => {
        pointsArray.push({
            id: doc.id,
            points: doc.data().points,
            description: doc.data().description,
            createdAt: doc.data().createdAt
        })

    })
    res.status(200).send(pointsArray)
})

//Read a category
router.get("/:id", async (req, res) => {
    const db = admin.firestore();
    const pointsCollection = db.collection("points");
    const points = await pointsCollection.doc(req.params.id).get();
    if (!points.exists) {
        res.status(404).send({
            message: "Category not found",
        });
    } else {
        res.status(200).send({
            id: points.id,
            points: points.data().points,
            description: points.data().description,
            createdAt: points.data().createdAt,
        });
    }
});


//delete points
router.delete("/:id", async (req, res) => {
    const db = admin.firestore()
    const pointsCollection = db.collection("points")
    const point = await pointsCollection.doc(req.params.id).get();

    if (!point.exists) {
        res.status(404).send({
            message: "user do not detected"
        })
    } else {
        await pointsCollection.doc(req.params.id).delete();
        res.status(200).send({
            message: " points deleted successfully"
        })
    }
})

module.exports = router;
