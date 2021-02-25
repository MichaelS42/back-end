const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Users = require("../../user-model.js");
const secret = require("../config/secret.js");
const db = require("../data/dbConfig.js");

router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then((saved) => {
      const token = generateToken(saved);
      res.status(201).json({
        created_user: saved,
        id: saved.id,
        token: token,
        message: "new user created",
      });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          username: user.username,
          id: user.id,
          token: token,
          message: "login successful",
        });
      } else {
        res.status(401).json({ message: "invalid creds" });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
  res.end("implement login, please!");
});

// function generateToken(user) {
//   const payload = {
//     subject: user.id,
//     username: user.username,
//     lat: Date.now(),
//   };
//   const options = {
//     expiresIn: "1h",
//   };
//   return jwt.sign(payload, jwtSecret, options);
// }
function generateToken(user) {
  const payload = {
    userid: user.id,
    username: user.username,
  };
  const options = { expiresIn: "1h" };
  const token = jwt.sign(payload, secret.jwtSecret, options);
  return token;
}

module.exports = router;
