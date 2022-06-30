const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Department = db.department;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            if (req.body.departments) {
              Department.find(
                {
                  name: { $in: req.body.departments },
                },
                (err, departments) => {
                  if (err) {
                    res.status(500).send({ message: err });
                    return;
                  }

                  user.departments = departments.map(
                    (department) => department._id
                  );
                  user.save((err) => {
                    if (err) {
                      res.status(500).send({ message: err });
                      return;
                    }

                    res.send({ message: "User was registered successfully!" });
                  });
                }
              );
            }
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        console.log("user-----", user);
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .populate("departments", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      var departments = [];

      for (let i = 0; i < user.departments.length; i++) {
        departments.push(user.departments[i].name);
      }
      let department = 0;
      console.log(user.departments);

      if (user.departments.length > 0) {
        department = user.departments[0]._id;
      }

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        departmentid: department,
        departments: departments,
        accessToken: token,
      });
    });
};
