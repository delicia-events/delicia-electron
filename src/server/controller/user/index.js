var sql = require("../../db.js");

exports.appLogin = (req, res, next) => {
  const userName = req.body.userName;
  const userPassword = req.body.userPassword;
  let sqlString =
    "SELECT * from account_settings WHERE username= '" +
    userName +
    "' AND password= '" +
    userPassword +
    "'";
  sql.query(sqlString, function (err, result) {
    if (!err) {
      if (result[0] !== undefined) {
        res.status(200).json({
          userDetails: {
            userName: result[0].username,
            userId: result[0].user_id,
          },
        });
      } else {
        res.status(401).json({ errorDetails: "Unauthorized User" });
      }
    } else {
      throw err;
    }
  });
};
