const express = require("express");
// const { body } = require("express-validator");
const WorkController = require("../../controller/work");

const router = express.Router();
router.get(
  "/workdetails",
  // [
  //   body("userEmail").exists().isEmail().normalizeEmail(),
  //   body("userPassword").exists().isLength({ min: 8 }),
  //   body("auctioneerUID").exists().isLength({ max: 3 }),
  // ],
  WorkController.workDetails
);

router.post(
  "/creatework",
  // [
  //   body("userEmail").exists().isEmail().normalizeEmail(),
  //   body("userPassword").exists().isLength({ min: 8 }),
  //   body("auctioneerUID").exists().isLength({ max: 3 }),
  // ],
  WorkController.createWork
);

router.get("/salarySettled/:workId", WorkController.checkSalarySettled);
router.post("/salarySettlement/:workId", WorkController.salarySettlement);
router.post("/createExpence/:workId", WorkController.createExpence);
router.put("/updateWorkStatus/:workId", WorkController.updateWorkStatus);
router.get("/workStatistics/:workId", WorkController.workStatistics);
router.put("/updateSalary/:workId", WorkController.updateSalary);
router.get("/staffSalaryData/:workId", WorkController.getStaffSalaryData);
router.post(
  "/deleteSettledSalarys/:workId",
  WorkController.deleteSettledSalarys
);
router.post("/deleteSettledSalary/:workId", WorkController.deleteSettledSalary);
router.get("/workhistory/", WorkController.getWorkhistory);

module.exports = router;
