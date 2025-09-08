const fs = require("fs");

function logReqRes(filename) {
  return (req, res, next) => {
    fs.appendFile(
      filename,
      `\n${Date.now()}: ${req.method} ${req.path}`,
      (err) => {
        if (err) {
          console.log("ERROR WRITING IN LOG FILE!!!!!!!!!!!!!", err);
        }
      },
    );

    // ✅ move request forward
    next();
  };
}

module.exports = logReqRes;
