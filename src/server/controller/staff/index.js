var sql = require("../../db.js");

exports.staffDetails = (req, res, next) => {
  let sqlString = "SELECT * from staff_details";
  sql.query(sqlString, function (err, result) {
    if (!err) {
      res
        .status(200)
        .json({ message: "Staff details fetched.", staffDetails: result });
    } else {
      throw err;
    }
  });
};

exports.createStaff = (req, res, next) => {
  const staffName = req.body.staffName;
  const staffMobileNo = req.body.staffMobileNo;
  let sqlString =
    "INSERT INTO staff_details (staff_name, staff_phone_no) VALUES ('" +
    staffName +
    "','" +
    staffMobileNo +
    "')";
  sql.query(sqlString, function (err, result) {
    if (err) {
      res.status(409).json({ message: "Staff alread exist." });
    } else {
      res.status(201).json({ message: "New staff created sucesfully." });
    }
  });
};

exports.staffOutstandingBalance = (req, res, next) => {
  const staffId = req.params.staffId;
  let sqlString =
    "SELECT SUM(amount) AS totalSalary FROM staff_slary_split WHERE staff_id ='" +
    staffId +
    "';SELECT SUM(amount) AS paidSalary FROM staff_payment_log where staff_id ='" +
    staffId +
    "';";
  sql.query(sqlString, function (err, result) {
    if (!err) {
      let totalSalary = result[0][0].totalSalary || 0;
      let paidSalary = result[1][0].paidSalary || 0;
      let outstandingBalance = totalSalary - paidSalary;
      res.status(200).json({ outstandingBalance: outstandingBalance });
    } else {
      throw err;
    }
  });
};

exports.createPayments = (req, res, next) => {
  const staffId = req.params.staffId;
  const amount = req.body.amount;
  const date = req.body.date;
  const description = req.body.description;

  let sqlString =
    "INSERT INTO staff_payment_log (staff_id, amount, payment_date,description) VALUES ('" +
    staffId +
    "', '" +
    amount +
    "','" +
    date +
    "','" +
    description +
    "')";
  sql.query(sqlString, function (err, result) {
    if (!err) {
      res.status(201).json({ message: "Payment details added sucesfully." });
    } else {
      throw err;
    }
  });
};

exports.getPayments = (req, res, next) => {
  const staffId = req.params.staffId;
  const dateFrom = req.query.dateFrom;
  const dateTo = req.query.dateTo;

  let sqlString = `SELECT * FROM staff_payment_log WHERE staff_id=${staffId}
    AND payment_date BETWEEN '${dateFrom}' AND '${dateTo}';`;
  sql.query(sqlString, function (err, result) {
    if (!err) {
      res
        .status(200)
        .json({ message: "Payment details feteched.", payments: result });
    } else {
      throw err;
    }
  });
};

exports.getEarnings = (req, res, next) => {
  const staffId = req.params.staffId;
  const dateFrom = req.query.dateFrom;
  const dateTo = req.query.dateTo;

  let sqlString = `SELECT staff_slary_split.entry_id,work_details.work_name,work_details.work_place,work_details.work_date, staff_slary_split.work_type, staff_slary_split.amount
  FROM staff_slary_split INNER JOIN work_details ON staff_slary_split.work_id=work_details.work_id WHERE staff_slary_split.staff_id=${staffId}
  AND work_details.work_date BETWEEN '${dateFrom}' AND '${dateTo}';`;
  sql.query(sqlString, function (err, result) {
    if (!err) {
      res
        .status(200)
        .json({ message: "Payment details feteched.", earnings: result });
    } else {
      throw err;
    }
  });
};

exports.deletePayment = (req, res, next) => {
  const staffId = req.params.staffId;
  const entryId = req.body.entryId;

  let sqlString = `DELETE FROM staff_payment_log WHERE staff_id=${staffId}
  AND entry_id=${entryId};`;
  sql.query(sqlString, function (err, result) {
    if (!err) {
      res
        .status(201)
        .json({ message: "Payment sucessfully deleted.", earnings: result });
    } else {
      throw err;
    }
  });
};
