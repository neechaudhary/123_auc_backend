const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");
//JSOn web token 
const jwt = require("jsonwebtoken");
const db = admin.firestore();
bcrypt = require("bcryptjs");

//Login user
router.post("/", async (req, res) => {

  const usersCollection = db.collection("users");

  //Find user by email
  const snapshot = await usersCollection.where("email", "==", req.body.email).get();
  if (snapshot.empty) {
    //Return json error
    res.status(400).json({ error: "User not found", message: "User not found" });
  }


  snapshot.forEach(doc => {
    //Compair bcrypt password
    const passwordIsValid = bcrypt.compareSync(req.body.password, doc.data().password);
    if (passwordIsValid !== true) {
      res.status(400).send({
        message: "Invalid password",
        status: "error",
      });
    }

    //Generate token
    const token = jwt.sign({
      id: doc.id,
      email: doc.data().email,
      username: doc.data().username,
    }, "secret", {
      expiresIn: 86400 // expires in 24 hours
    });


    //Set cookie
    res.cookie("token", token, {
      maxAge: 86400000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    //Set header
    res.header("auth-token", token);

    //Return token
    res.status(200).send({
      message: "Login successful",
      status: "success",
      token: token,
    });
  });
});

router.post("/check", async (req, res) => {
  //Get token 
  const token = req.headers["auth-token"] || req.body.token || req.cookies.token;

  if (!token) {
    return res.status(200).send({
      message: "No token provided",
      status: "error",
      islogged: false,
    });
  }

  //Verify token
  jwt.verify(token, "secret", function (err, decoded) {
    if (err) {
      return res.status(200).send({
        message: "Failed to authenticate token",
        status: "error",
        islogged: false,
      });
    } else {
      return res.status(200).send({
        message: "Token is valid",
        status: "success",
        islogged: true,
      });
    }
  });
});

module.exports = router;
