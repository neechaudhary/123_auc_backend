const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.post("/", (req, res) => {
  const db = admin.firestore();
  const companiesCollection = db.collection("companies");

  //genetate random userid
  const userid =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  //add points to the collection
  companiesCollection.add({
    userid: userid,
    username: req.body.username,
    companyName: req.body.companyName,
    companyType: req.body.companyType,
    companyExperience: req.body.companyExperience,
    companyDescription: req.body.companyDescription,
    companyAddress: req.body.companyAddress,
    companyEmail: req.body.companyEmail,
    createdAt: new Date().toISOString(),
  });
  res.status(200).send({
    message: "Your company has been added",
  });
});

//read all services details
router.get("/", async (req, res) => {
  const db = admin.firestore()
  const companiesCollection = db.collection("companies")

  const company = await companiesCollection.get();
  const companyArray = [];
  company.forEach((doc) => {
    companyArray.push({
      id: doc.id,
      username: doc.data().username,
      companyName: doc.data().companyName,
      companyType: doc.data().companyType,
      companyExperience: doc.data().companyExperience,
      companyDescription: doc.data().companyDescription,
      companyAddress: doc.data().companyAddress,
      companyEmail: doc.data().companyEmail,
      createdAt: doc.data().createdAt
    })

  })
  res.status(200).send(companyArray)
})



//update points
router.put("/:id", async (req, res) => {
  const db = admin.firestore()
  const companiesCollection = db.collection("companies");

  const companies = await companiesCollection.doc(req.params.id).get();
  if (!companies.exists) {
    res.status(404).send({
      message: "company name not found",
    })
  } else {
    await companiesCollection.doc(req.params.id).update({
      username: req.body.username,
      companyName: req.body.companyName,
      companyType: req.body.companyType,
      companyExperience: req.body.companyExperience,
      companyDescription: req.body.companyDescription,
      companyAddress: req.body.companyAddress,
      companyEmail: req.body.companyEmail
    })
    res.status(200).send({
      message: "your company has been updated"
    })
  }
  //   console.log(req.params.id);
});


//delete companies
router.delete("/:id", async (req, res) => {
  const db = admin.firestore()
  const companiesCollection = db.collection("companies")
  const companies = await companiesCollection.doc(req.params.id).get();

  if (!companies.exists) {
    res.status(404).send({
      message: "company name not availabel, please try with another name"
    })
  } else {
    await companiesCollection.doc(req.params.id).delete();
    res.status(200).send({
      message: " company deleted"
    })
  }
})

module.exports = router;