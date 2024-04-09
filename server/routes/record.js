const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the tatoueurs.
recordRoutes.route("/record").get(async function (req, response) {
  let db_connect = dbo.getDb();

  try {
    var tatoueurs = await db_connect
      .collection("tatoueurs")
      .find({})
      .toArray();
    response.json(tatoueurs);
  } catch (e) {
    console.log("An error occurred pulling the tatoueurs. " + e);
  }

});

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id) };
  db_connect
    .collection("tatoueurs")
    .findOne(myquery, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});



// This section will help you create a new record.
recordRoutes.route("/record/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    name: req.body.name,
    password: req.body.password,
    address: req.body.address,
    website: req.body.website,
    numTel: req.body.numTel,
    photoDeProfil: req.body.photoDeProfil,
    portofolio: [req.body.portofolio],
    description: req.body.description,
    styles: req.body.styleId ? [req.body.styleId] : [],
    avis: [{}, {}],
    note: req.body.note,
  };
  db_connect.collection("tatoueurs").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    },
  };
  db_connect
    .collection("tatoueurs")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});


// Ajout d'un nouvel avis 
recordRoutes.route("/avis/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id) };
  let newAvis = {
    $push: {
      avis: {
        _id: "Id de l'utilisateur",
        avis: req.body.avis, // L'avis laissé par l'utilisateur

      }
    }
  };

  db_connect.collection("tatoueurs").findOneAndUpdate(myquery, newAvis, { returnNewDocument: true }, function (err, res) {
    if (err) {
      console.error("Erreur lors de l'ajout de l'avis:", err);
      response.status(500).send("Une erreur s'est produite lors de l'ajout de l'avis.");
    } else {
      console.log("Avis ajouté avec succès");
      response.json(res.value);
    }
  });
});

// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id) };
  db_connect.collection("tatoueurs").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

recordRoutes.route("/style").get(async function (req, response) {
  let db_connect = dbo.getDb();

  try {
    var style = await db_connect
      .collection("styles")
      .find({})
      .toArray();
    response.json(style);
  } catch (e) {
    console.log("An error occurred pulling the style. " + e);
  }

});

module.exports = recordRoutes;