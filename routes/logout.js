const path = require("path");
const express = require("express");
const router = express.Router();

// router.post("/", (req, res) => {
//   req.logOut();
//   res.redirect("login");
// });


router.post("/", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
