const express = require('express');
const Workshop = require('./workshop.model');
const { postAWorkshop, getAllWorkshops, getSingleWorkshop, UpdateWorkshop, deleteAWorkshop } = require('./workshop.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const router =  express.Router();

// frontend => backend server => controller => workshop schema  => database => send to server => back to the frontend
//post = when submit something fronted to db
// get =  when get something back from db
// put/patch = when edit or update something
// delete = when delete something

// post a workshop
// In workshop.route.js
router.post("/create-workshop", postAWorkshop) // Remove verifyAdminToken
// get all workshops
router.get("/", getAllWorkshops);

// single workshop endpoint
router.get("/:id", getSingleWorkshop);

// update a workshop endpoint
router.put("/edit/:id", verifyAdminToken, UpdateWorkshop);

router.delete("/:id", verifyAdminToken, deleteAWorkshop)


module.exports = router;