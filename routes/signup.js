const path = require("path");
const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get('/', (req, res)=>{
    res.render('signup', {
        SignUp : "SignUp"

    });
})

router.post("/", async (req, res) => {
  const { name, email, password, pic} = req.body;
  console.log(name, email, password, pic);
  if(!name || !email || !password){
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }
  try {
    let user = await User.findOne({ email });
    if (user) {
      res.render("login", {
        note: "Already Registered"
      });
    } else {
      bcrypt.genSalt(saltRounds, async function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
          await User.create({
            name,
            email,
            password: hash,
            pic
          });
          res.render("login", {
            regissuccess : "Registration Successful"
          });
        });
      });
    }
  } catch (err) {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

module.exports = router;