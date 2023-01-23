const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");


//create services
router.post("/", (req, res) => {
    const db = admin.firestore();
    const servicesCollection = db.collection("services");

    //genetate random userid
    const userid =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

    //add services to the collection
    servicesCollection.add({
        userid: userid,
        username: req.body.username,
        serviceName: req.body.serviceName,
        serviceTitle: req.body.serviceTitle,
        createdAt: new Date().toISOString(),
    });
    res.status(200).send({
        message: "services added",
    });
});

//read all services details
router.get("/", async (req, res) => {
    const db = admin.firestore()
    const servicesCollection = db.collection("services")

    const services = await servicesCollection.get();
    const servicesArray = [];
    services.forEach((doc) => {
        servicesArray.push({
            id: doc.id,
            username: doc.data().username,
            serviceName: doc.data().serviceName,
            serviceTitle: doc.data().serviceTitle,
            createdAt: doc.data().createdAt
        })

    })
    res.status(200).send(servicesArray)
})

//Read a service
router.get("/:id", async (req, res) => {
    const db = admin.firestore();
    const servicesCollection = db.collection("services");
    const services = await servicesCollection.doc(req.params.id).get();
    if (!services.exists) {
        res.status(404).send({
            message: "service not found",
        });
    } else {
        res.status(200).send({
            id: services.id,
            username: services.data().points,
            serviceName: services.data().description,
            serviceTitle: services.data().serviceTitle,
            createdAt: services.data().createdAt,
        });
    }
});



//update points
router.put("/:id", async (req, res) => {
    const db = admin.firestore()
    const servicesCollection = db.collection("services");

    const services = await servicesCollection.doc(req.params.id).get();
    if (!services.exists) {
        res.status(404).send({
            message: "services not found",
        })
    } else {
        await servicesCollection.doc(req.params.id).update({
            username: req.body.username,
            serviceName: req.body.serviceName,
            serviceTitle: req.body.serviceTitle
        })
        res.status(200).send({
            message: " services updated successfully"
        })
    }
    //   console.log(req.params.id);
});


//delete points
router.delete("/:id", async (req, res) => {
    const db = admin.firestore()
    const servicesCollection = db.collection("services")
    const services = await servicesCollection.doc(req.params.id).get();

    if (!services.exists) {
        res.status(404).send({
            message: "service name is not available"
        })
    } else {
        await servicesCollection.doc(req.params.id).delete();
        res.status(200).send({
            message: " service deleted successfully"
        })
    }
})

module.exports = router;