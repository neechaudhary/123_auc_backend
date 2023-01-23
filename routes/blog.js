const express = require('express');
const { route } = require('./login');
var slugify = require("slugify")
const router = express.Router();
const admin = require("firebase-admin");

router.post("/", (req, res) => {

    const db = admin.firestore();
    const blog = db.collection("blog")

    //Generate Random user id
    const userId =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

    //Generate slug with filter and replace spaces with dashes
    const slug = slugify(req.body.title, {
        replacement: "-",
        remove: /[*+~.()'"!:@]/g,
        lower: true,
    });

    //add new blog
    blog.add({
        user: userId,
        title: req.body.title,
        slug: slug,
        categories: req.body.categories,
        body: req.body.body,
        createdAt: new Date().toISOString()

    })

    //send response
    res.status(200).send({
        message: "Your blog has beeen published"
    })
})


//update blog
router.put("/:id", async (req, res) => {
    const db = admin.firestore();
    const blog = db.collection("blog")

    //if user exist or not
    const user_exist = await blog.doc(req.params.user).get();
    if (!user_exist.exists) {
        res.status(400).send({
            message: " user not available"
        })
    } else {
        await blog.doc(req.params.id).update({
            title: req.body.title,
            categories: req.body.categories,
            body: req.body.body
        })

        //send response
        res.status(200).send({
            message: "Your blog has been successfully updated"
        })
    }

})

//read a blog
router.get("/:id", async (req, res) => {
    const db = admin.firestore();
    const blogcollection = db.collection("blog")

    //check if user exist
    const user = await blogcollection.doc(req.params.id).get();
    if (!user.exists) {
        res.status(400).send({
            message: "user not found"
        })
    } else {
        res.status(200).send({
            user: user.id,
            title: user.data().title,
            categories: user.data().categories,
            body: user.data().body
        })
    }
})

//delete
router.delete("/:id", async (req, res) => {
    const db = admin.firestore();
    const blogCollection = db.collection("blog");
    const blog = await blogCollection.doc(req.params.id).get();
    if (!blog.exists) {
        res.status(404).send({
            message: "Please check your id",
        });
    } else {
        await blogCollection.doc(req.params.id).delete();
        res.status(200).send({
            message: "blog has been deleted successfully",
        });
    }
});

//Get all blogs
router.get("/", async (req, res) => {
    const db = admin.firestore();
    const blogCollection = db.collection("blog");
    const blog = await blogCollection.get();
    const blogArray = [];
    blog.forEach((doc) => {
        blogArray.push({
            id: doc.id,
            title: doc.data().title,
            categories: doc.data().categories,
            body: doc.data().body,
        });
    });
    res.status(200).send(blogArray);
});

module.exports = router 