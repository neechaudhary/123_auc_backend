const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

//add buyer
router.post("/buyer", (req, res) => {
    const db = admin.firestore();
    const classificationCollectionbuyer = db.collection("classification/buyer/buyerdetails");

    //generate random tagid
    const buyerid =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

    //Add new bid to the collection 
    classificationCollectionbuyer.add({
        buyerid: buyerid,
        bname: req.body.bname,
        bEmail: req.body.bEmail,
        bDescription: req.body.bDescription,
        bcreatedAt: new Date().toISOString(),
    });

    //Send response
    res.status(200).send({
        message: "You has been added as buyer successfully",

    });
});

//add seller
router.post("/seller", (req, res) => {
    const db = admin.firestore();
    const classificationCollectionseller = db.collection("classification/seller/sellerdetails");

    //generate random tagid
    const sellerid =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

    //Add new bid to the collection 
    classificationCollectionseller.add({
        sellerid: sellerid,
        sname: req.body.sname,
        sEmail: req.body.sEmail,
        sDescription: req.body.sDescription,
        screatedAt: new Date().toISOString(),
    });

    //Send response
    res.status(200).send({
        message: "You has been added as seller successfully",

    });
});

//Read all buyer classification
router.get("/readBuyer", async (req, res) => {
    const db = admin.firestore();
    const classificationCollectionbuyer = db.collection("classification/buyer/buyerdetails");
    const classification = await classificationCollectionbuyer.get();
    const classificationArraybuyer = [];
    classification.forEach((doc) => {
        classificationArraybuyer.push({
            buyerid: doc.data().buyerid,
            bname: doc.data().bname,
            bEmail: doc.data().bEmail,
            bDescription: doc.data().bDescription,
            bcreatedAt: doc.data().bcreatedAt,
        });
    });
    res.status(200).send(classificationArraybuyer);
});

//Read all seller classification
router.get("/readseller", async (req, res) => {
    const db = admin.firestore();
    const classificationCollection = db.collection("classification/seller/sellerdetails");
    const classification = await classificationCollection.get();
    const classificationArray = [];
    classification.forEach((doc) => {
        classificationArray.push({
            sellerid: doc.data().sellerid,
            sname: doc.data().sname,
            sEmail: doc.data().sEmail,
            sDescription: doc.data().sDescription,
            screatedAt: doc.data().screatedAt,
        });
    });
    res.status(200).send(classificationArray);
});


//Update a buyer
router.put("/buyer/:id", async (req, res) => {
    const db = admin.firestore();
    const classificationCollection = db.collection("classification/buyer/buyerdetails");
    const classification = await classificationCollection.doc(req.params.id).get();
    if (!classification.exists) {
        res.status(404).send({
            message: "buyer with this id is not available",
        });
    } else {
        await classificationCollection.doc(req.params.id).update({

            bname: req.body.bname,
            bDescription: req.body.bDescription,
            bEmail: req.body.bEmail
        });
        res.status(200).send({
            message: "buyer has been updated",
        });
    }
});

//Update a seller
router.put("/seller/:id", async (req, res) => {
    const db = admin.firestore();
    const classificationCollection = db.collection("classification/seller/sellerdetails");
    const classification = await classificationCollection.doc(req.params.id).get();
    if (!classification.exists) {
        res.status(404).send({
            message: "seller with this id is not available",
        });
    } else {
        await classificationCollection.doc(req.params.id).update({
            sname: req.body.sname,
            sEmail: req.body.sEmail,
            sDescription: req.body.sDescription,
        });
        res.status(200).send({
            message: "selller has been updated",
        });
    }
});


//Delete a buyer
router.delete("/buyer/:id", async (req, res) => {
    const db = admin.firestore();
    const classificationCollection = db.collection("classification/buyer/buyerdetails");
    const classification = await classificationCollection.doc(req.params.id).get();
    if (!classification.exists) {
        res.status(404).send({
            message: "Please check your id",
        });
    } else {
        await classificationCollection.doc(req.params.id).delete();
        res.status(200).send({
            message: "buyer been deleted successfully",
        });
    }
});

//Delete a seller
router.delete("/seller/:id", async (req, res) => {
    const db = admin.firestore();
    const classificationCollection = db.collection("classification/seller/sellerdetails");
    const classification = await classificationCollection.doc(req.params.id).get();
    if (!classification.exists) {
        res.status(404).send({
            message: "Please check your id",
        });
    } else {
        await classificationCollection.doc(req.params.id).delete();
        res.status(200).send({
            message: "seller has been deleted successfully",
        });
    }
});

//Get all classification
router.get("/", async (req, res) => {
    const db = admin.firestore();
    const classificationCollection = db.collection("classification");
    const classification = await classificationCollection.get();
    const classificationArray = [];
    classification.forEach((doc) => {
        classificationArray.push({
            id: doc.id,
        });
    });
    res.status(200).send(classificationArray);
});


module.exports = router;