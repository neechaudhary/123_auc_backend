const express = require('express');
const router = express.Router();
const admin = require("firebase-admin")


//search products
//Create Search API
router.get("/:name", async (req, res) => {
  const db = admin.firestore();
  const searchcollection = db.collection("products");
  // const search_results= searchcollection.get();

  console.log(req.params.name);
  //   dbRef.where('producto.items', 'array-contains', { producto: req.params.nombre})
  try {
    var data = [];
    const byName = await searchcollection.get();
    console.log(byName);
    if (byName.empty) {
      console.log('No matching documents.');
      res.send('No matching documents.');
      return;
    }

    byName.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
      data.push(doc.data());
    });

    res.send(data);
  } catch (err) {
    res.send(err);
  }
});




module.exports = router