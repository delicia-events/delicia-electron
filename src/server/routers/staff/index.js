const express = require("express");
// const { body } = require("express-validator");
const StaffController = require("../../controller/staff");

const router = express.Router();
router.get(
  "/staffdetails",
  // [
  //   body("userEmail").exists().isEmail().normalizeEmail(),
  //   body("userPassword").exists().isLength({ min: 8 }),
  //   body("auctioneerUID").exists().isLength({ max: 3 }),
  // ],
  StaffController.staffDetails
);

router.post(
  "/createstaff",
  // [
  //   body("userEmail").exists().isEmail().normalizeEmail(),
  //   body("userPassword").exists().isLength({ min: 8 }),
  //   body("auctioneerUID").exists().isLength({ max: 3 }),
  // ],
  StaffController.createStaff
);
router.get(
  "/outstandingBalance/:staffId",
  StaffController.staffOutstandingBalance
);

router.post("/createPayments/:staffId", StaffController.createPayments);
router.get("/payments/:staffId", StaffController.getPayments);
router.get("/earnings/:staffId", StaffController.getEarnings);
router.post("/deletePayment/:staffId", StaffController.deletePayment);

module.exports = router;
