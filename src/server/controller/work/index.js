const sql = require("../../db.js");
const { lock } = require("../../routers/work/index.js");
const utils = require("../../utils");

exports.workDetails = (req, res, next) => {
  let sqlString = "SELECT * from work_details WHERE work_status=0";
  sql.query(sqlString, function (err, result) {
    if (!err) {
      res
        .status(200)
        .json({ message: "Work details fetched.", workDetails: result });
    } else {
      throw err;
    }
  });
};

exports.updateWorkStatus = (req, res, next) => {
  const workId = req.params.workId;
  let sqlString =
    "UPDATE work_details SET work_status=1 WHERE work_id='" + workId + "' ";
  sql.query(sqlString, function (err, result) {
    if (!err) {
      res.status(200).json({ message: "Work Closed Sucessfully." });
    } else {
      throw err;
    }
  });
};

exports.createWork = (req, res, next) => {
  const workName = req.body.workName;
  const date = req.body.date;
  const place = req.body.place;
  const workType = req.body.workType;
  const area = req.body.area || 0;
  const estimate = req.body.estimate;

  let sqlString =
    "INSERT INTO work_details (work_name, work_date, work_place,work_type, work_area, work_estimate) VALUES ('" +
    workName +
    "','" +
    date +
    "','" +
    place +
    "','" +
    workType +
    "','" +
    area +
    "','" +
    estimate +
    "'); SELECT total_labour_charge as fullWorkCharge, stage_total_labour_charge as stageTotalCharge from basic_configuration WHERE entry_id=1;";
  sql.query(sqlString, function (err, result) {
    if (!err) {
      let workId = result[0].insertId;
      let amount;

      if (workType === "panthal") {
        let fullWorkCharge = result[1][0].fullWorkCharge;
        amount = area * fullWorkCharge;
      } else if (workType === "mandapam") {
        let stageTotalCharge = result[1][0].stageTotalCharge;
        amount = (estimate / 100) * stageTotalCharge;
      }

      if (workType === "panthal" || workType === "mandapam") {
        let sqlString =
          "INSERT INTO expences (work_id, amount, expence_date, expence_name, expence_category, settled) VALUES ('" +
          workId +
          "', '" +
          amount +
          "','" +
          date +
          "','Staff Salary','salary', '0')";
        sql.query(sqlString, function (err, result) {
          if (!err) {
            res.status(201).json({ message: "New work created sucesfully." });
          } else {
            throw err;
          }
        });
      } else {
        res.status(201).json({ message: "New work created sucesfully." });
      }
    } else {
      throw err;
    }
  });
};

exports.checkSalarySettled = (req, res, next) => {
  const workId = req.params.workId;
  let sqlString =
    "SELECT * from expences where work_id='" +
    workId +
    "' AND expence_category='salary';";
  sql.query(sqlString, function (err, result) {
    if (!err) {
      res.status(200).json({
        message: "fetched salary details",
        salarySettlement: result,
      });
    } else {
      throw err;
    }
  });
};

exports.salarySettlement = (req, res, next) => {
  const workId = req.params.workId;
  const staffDetails = req.body.staffDetails;
  const staffShare = req.body.staffShare;
  const basicConfig = req.body.basicConfig;
  const workType = req.body.workType;

  let weageClaimed = utils.wageSpliter(
    staffDetails,
    staffShare,
    basicConfig,
    workType
  );

  let records = [];
  staffDetails.forEach((staffData) => {
    let sharePerHead;
    if (staffData.workType === "setup") {
      sharePerHead = weageClaimed.perheadSetup;
    } else if (staffData.workType === "phaseout") {
      sharePerHead = weageClaimed.perheadPhaseout;
    } else if (staffData.workType === "fullwork") {
      sharePerHead = weageClaimed.perheadFullwork;
    }

    records.push([workId, staffData.staffId, staffData.workType, sharePerHead]);
  });

  let sqlString =
    "UPDATE expences SET settled = 1 where work_id='" +
    workId +
    "';INSERT INTO staff_slary_split (work_id, staff_id,work_type, amount) VALUES ?";
  sql.query(sqlString, [records], function (err, result) {
    if (!err) {
      res.status(201).json({
        message: "Sucessfully distributed salary",
      });
    } else {
      throw err;
    }
  });
};

exports.createExpence = (req, res, next) => {
  const workId = req.params.workId;
  const date = req.body.date;
  const amount = req.body.amount;
  const category = req.body.category;
  const details = req.body.details;

  let sqlString =
    "INSERT INTO expences (work_id, amount, expence_date,expence_name , expence_category) VALUES ('" +
    workId +
    "', '" +
    amount +
    "','" +
    date +
    "','" +
    details +
    "','" +
    category +
    "')";
  sql.query(sqlString, function (err, result) {
    if (!err) {
      res.status(201).json({ message: "Expence created sucesfully." });
    } else {
      throw err;
    }
  });
};

exports.workStatistics = (req, res, next) => {
  const workId = req.params.workId;

  let sqlString = `SELECT SUM(amount) AS totalExpence FROM expences where work_id=${workId};
     SELECT expence_category AS expenceCategory,SUM(amount)
     as expenceAmount FROM expences WHERE work_id= ${workId} GROUP BY expence_category;`;
  sql.query(sqlString, function (err, result) {
    if (!err) {
      res.status(200).json({
        totalExpence: result[0][0].totalExpence,
        expenceByCategory: result[1],
      });
    } else {
      throw err;
    }
  });
};

exports.updateSalary = (req, res, next) => {
  const workId = req.params.workId;
  const amount = req.body.amount;
  const expenceId = req.body.expenceId;

  let sqlString = `UPDATE expences SET amount=${amount} where work_id=${workId}
  AND expence_id=${expenceId};`;
  sql.query(sqlString, function (err, result) {
    if (!err) {
      res.status(201).json({
        message: "salary amount updted",
      });
    } else {
      throw err;
    }
  });
};

exports.getStaffSalaryData = (req, res, next) => {
  const workId = req.params.workId;

  let sqlString = `SELECT staff_slary_split.entry_id, staff_details.staff_id,
  staff_details.staff_name, staff_slary_split.work_type, staff_slary_split.amount
  FROM staff_slary_split
  INNER JOIN staff_details ON staff_slary_split.staff_id=staff_details.staff_id
  WHERE staff_slary_split.work_id=${workId};`;

  sql.query(sqlString, function (err, result) {
    if (!err) {
      res.status(200).json({
        staffSalaryData: result,
      });
    } else {
      throw err;
    }
  });
};

exports.deleteSettledSalarys = (req, res, next) => {
  const workId = req.params.workId;
  const staffDetails = req.body.staffDetails;
  const staffShare = req.body.staffShare;
  const basicConfig = req.body.basicConfig;
  const workType = req.body.workType;
  let weageClaimed = utils.wageSpliter(
    staffDetails,
    staffShare,
    basicConfig,
    workType
  );

  let records = [];
  staffDetails.forEach((staffData) => {
    let sharePerHead;
    if (staffData.workType === "setup") {
      sharePerHead = weageClaimed.perheadSetup;
    } else if (staffData.workType === "phaseout") {
      sharePerHead = weageClaimed.perheadPhaseout;
    } else if (staffData.workType === "fullwork") {
      sharePerHead = weageClaimed.perheadFullwork;
    }
    records.push([workId, staffData.staffId, staffData.workType, sharePerHead]);
  });

  let sqlString = `DELETE FROM staff_slary_split WHERE work_id=${workId};
    INSERT INTO staff_slary_split (work_id, staff_id,work_type, amount) VALUES ?;`;
  sql.query(sqlString, [records], function (err, result) {
    if (!err) {
      res.status(201).json({
        message: "Sucessfully modified salary distribution",
      });
    } else {
      throw err;
    }
  });
};

exports.deleteSettledSalary = (req, res, next) => {
  const workId = req.params.workId;
  let sqlString = `DELETE FROM staff_slary_split WHERE work_id=${workId};
  UPDATE expences SET settled = 0 where work_id=${workId};`;
  sql.query(sqlString, function (err, result) {
    if (!err) {
      res.status(201).json({
        message: "Sucessfully modified salary distribution",
      });
    } else {
      throw err;
    }
  });
};

exports.getWorkhistory = (req, res, next) => {
  const dateFrom = req.query.dateFrom;
  const dateTo = req.query.dateTo;

  let sqlString = `SELECT * from work_details WHERE work_status=1
  AND work_date BETWEEN '${dateFrom}' AND '${dateTo}';`;
  sql.query(sqlString, function (err, result) {
    if (!err) {
      res
        .status(200)
        .json({ message: "Work details fetched.", workDetails: result });
    } else {
      throw err;
    }
  });
};
