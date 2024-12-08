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
// Your routes look good, but let's organize them better
router.route('/')
    .get(getAllWorkshops)
    .post(postAWorkshop);

router.route('/:id')
    .get(getSingleWorkshop)
    .put(verifyAdminToken, UpdateWorkshop)
    .delete(verifyAdminToken, deleteAWorkshop);