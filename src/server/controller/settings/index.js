var sql = require("../../db.js");

exports.getSettings = (req, res, next) => {
  let sqlString = "SELECT * from basic_configuration";
  sql.query(sqlString, function (err, result) {
    if (!err) {
      res.status(200).json({ basicConfig: result[0] });
    } else {
      throw err;
    }
  });
};

exports.getAccountSettings = (req, res, next) => {
  let sqlString = "SELECT * from account_settings";
  sql.query(sqlString, function (err, result) {
    if (!err) {
      res.status(200).json({ accountSettings: result[0] });
    } else {
      throw err;
    }
  });
};

exports.updateSettings = (req, res, next) => {
  const sqftCharge = req.body.sqftCharge;
  const fullWorkCharge = req.body.fullWorkCharge;
  const setupCharge = req.body.setupCharge;
  const phaseoutCharge = req.body.phaseoutCharge;
  const stageTotalCharge = req.body.stageTotalCharge;
  const stageSetupCharge = req.body.stageSetupCharge;
  const stageFaceoutCharge = req.body.stageFaceoutCharge;

  let sqlString =
    "UPDATE basic_configuration SET sqft_charge='" +
    sqftCharge +
    "', total_labour_charge= '" +
    fullWorkCharge +
    "', setup_labour_charge= '" +
    setupCharge +
    "', phaseout_labour_charge= '" +
    phaseoutCharge +
    "', stage_total_labour_charge= '" +
    stageTotalCharge +
    "', stage_setup_labour_charge= '" +
    stageSetupCharge +
    "', stage_phaseout_labour_charge= '" +
    stageFaceoutCharge +
    "' WHERE entry_id=1 ";
  sql.query(sqlString, function (err, result) {
    if (!err) {
      res.status(200).json({ message: result });
    } else {
      throw err;
    }
  });
};

exports.updateAccountSettings = (req, res, next) => {
  let sqlString = "SELECT * from account_settings";
  sql.query(sqlString, function (err, result) {
    if (!err) {
      res.status(200).json({ accountSettings: result[0] });
    } else {
      throw err;
    }
  });
};
