//smpt details
//sms
//email template
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.post("/", (req, res) => {
  const db = admin.firestore();
  const settingcollection = db.collection("setting");

  //Generate Random user id
  const userId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  //add new blog
  settingcollection.add({
    user: userId,
    smtp: req.body.smtp,
    sms: req.body.sms,
    email: req.body.email,
  });

  //send response
  res.status(200).send({
    message: "You added a setting",
  });
});

//update setting
router.put("/:id", async (req, res) => {
  console.log(req.params.id);

  const db = admin.firestore();
  const settingcollection = db.collection("setting");

  //check if user_exist
  const setting = await settingcollection.doc(req.params.id).get();
  if (!setting.exists) {
    res.status(400).send({
      message: "incorrect details",
    });
  } else {
    await settingcollection.doc(req.params.id).update({
      smtp: req.body.smtp,
      sms: req.body.sms,
      email: req.body.email,
    });
    //send response
    res.status(200).send({
      message: "settings updated successfully",
    });
  }
});

//read setting
router.get("/:id", async (req, res) => {
  const db = admin.firestore();
  const invoiceCollection = db.collection("setting");

  //check if user exist
  const user_exist = await invoiceCollection.doc(req.params.id).get();
  if (!user_exist.exists) {
    res.send(400).send({
      message: "please check the user",
    });
  } else {
    res.status(200).send({
      invoiceid: user_exist.id,
      smtp: user_exist.data().smtp,
      sms: user_exist.data().sms,
      email: user_exist.data().email,
    });
  }
});

//Delete a setting
router.delete("/:id", async (req, res) => {
  const db = admin.firestore();
  const settingCollection = db.collection("setting");
  const setting = await settingCollection.doc(req.params.id).get();
  if (!setting.exists) {
    res.status(404).send({
      message: "Please re-check the id",
    });
  } else {
    await settingCollection.doc(req.params.id).delete();
    res.status(200).send({
      message: "setting deleted successfully",
    });
  }
});
module.exports = router;
