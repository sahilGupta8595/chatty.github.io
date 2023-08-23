if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const app = express();
const hbs = require("hbs");
const mongoose = require("mongoose");
const passport = require("./auth/passport");
const session = require("express-session");
const flash = require("express-flash");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const checkAuthenticated = require("./middlewares/checkAuthenticated");
const checkNotAuthenticated = require("./middlewares/checkNotAuthenticated");
const User = require("./models/userSchema");

app.set("view engine", "hbs");

dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/signup", checkNotAuthenticated, require("./routes/signup"));
app.use("/login", checkNotAuthenticated, require("./routes/login"));
app.use("/logout", checkAuthenticated, require("./routes/logout"));

app.use("/allusers", require("./routes/allusers"));

app.use("/chat", require("./routes/chatRoutes"));

app.use("/message", require("./routes/messageRoutes"));

app.get("/profile", checkAuthenticated, (req, res) => {
  console.log(req.user);
  console.log(req.user.name);
  res.render("profile", {
    name: req.user.name,
    Home: "Home",
  });
});

io.on("connection", (socket) => {
  socket.emit("isloggedin", "loggedin");
  socket.on("sendmessage", (msg)=>{
    console.log(msg);
    io.emit("reply", {
      msg,
      senderId: socket.id,
    });
  })
});


// set the PORT
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection establiashed");
    server.listen(PORT, () => {
      console.log(`http://localhost:` + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
