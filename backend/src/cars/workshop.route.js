const express = require("express");

const router = express.Router();
const {
  postAWorkshop,
  getAllWorkshops,
  getSingleWorkshop,
  UpdateWorkshop,
  deleteAWorkshop,
} = require("./workshop.controller");

router.get("/", getAllWorkshops);
router.post("/create-workshop", postAWorkshop);
router.get("/:id", getSingleWorkshop);
router.put("/:id", UpdateWorkshop);
router.delete("/:id", deleteAWorkshop);

module.exports = router;
