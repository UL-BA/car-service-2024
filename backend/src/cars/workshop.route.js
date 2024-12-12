const express = require('express');
const router = express.Router();
const { postAWorkshop, getAllWorkshops, getSingleWorkshop, UpdateWorkshop, deleteAWorkshop } = require('./workshop.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');

router.post("/create-workshop", postAWorkshop);
router.get("/", getAllWorkshops);
router.get("/:id", getSingleWorkshop);
router.put("/edit/:id", verifyAdminToken, UpdateWorkshop);
router.delete("/:id", verifyAdminToken, deleteAWorkshop);

module.exports = router;