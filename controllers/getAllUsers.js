const User = require("../models/userSchema");

// user is authenticated

const getAllUsers = async (req, res, next) => {
  const { search } = req.query;
  if (req.isAuthenticated()) {
    const keyword = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    let users = await User.find(keyword);
    console.log(req.user._id);
    users = users.filter((user)=>user.email != req.user.email)
    res.send(users);

  } else {
    res.redirect("/login");
  }
};

module.exports = getAllUsers;
