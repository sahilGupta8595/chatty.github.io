const path = require("path");
const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("login", {
    login: "login"
  });
});

router.post(
  "/",
  passport.authenticate("local", { failureRedirect: "/login" , failureFlash: true}),
  function (req, res) {
    res.redirect("/profile");
  }
);

module.exports = router;
