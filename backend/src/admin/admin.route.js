const express = require("express");
const router = express.Router();
const {
  getAllServices,
  addService,
  updateService,
  deleteService,
} = require("./admin.controller");
const { verifyAdminToken } = require("../middleware/auth.middleware.js");

router.use(verifyAdminToken);

router.get("/", getAllServices);
router.post("/create-workshop", addService);
router.put("/:id", updateService); 
router.delete("/:id", deleteService);

module.exports = router;
