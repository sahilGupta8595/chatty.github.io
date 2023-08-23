const express = require("express");

function checkNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }

  res.redirect("/profile");
}

module.exports = checkNotAuthenticated;