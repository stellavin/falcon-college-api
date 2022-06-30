const config = require("../config/auth.config");
const db = require("../models");
const Lecture = db.lecture;
const Department = db.department;

exports.addLecture = (req, res) => {
  const lecture = new Lecture({
    name: req.body.name,
    credit: req.body.credit,
  });

  lecture.save((err, lecture) => {
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

          lecture.departments = departments.map((department) => department._id);
          lecture.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "Lecture was registered successfully!" });
          });
        }
      );
    }
  });
};

exports.allLectures = (req, res) => {
  Lecture.find()
    .populate("departments", "-__v")
    .exec((err, lecture) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      let newObject = [];

      for (let i = 0; i < lecture.length; i++) {
        let lecObj = lecture[i];
        let lecDepartments = lecture[i].departments;
        var departmentsData = [];
        for (let i = 0; i < lecDepartments.length; i++) {
          departmentsData.push(lecDepartments[i].name);
        }
        let obj = {
          id: lecObj._id,
          name: lecObj.name,
          credit: lecObj.credit,
          departments: departmentsData,
        };

        newObject.push(obj);
      }

      res.status(200).send(newObject);
    });
};

exports.departmentLectures = (req, res) => {
  res.status(200).send("departmentLectures");
};

exports.allDepartments = (req, res) => {
  Department.find((err, department) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    let newObject = [];

    for (let i = 0; i < department.length; i++) {
      let obj = {
        id: department[i]._id,
        name: department[i].name,
      };
      newObject.push(obj);
    }
    res.status(200).send(newObject);
  });
};

exports.getLecturesPerDepartment = (req, res) => {
  Lecture.find({ departments: { $all: [req.body.department] } })
    .populate("departments", "-__v")
    .exec((err, lecture) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      let newObject = [];

      for (let i = 0; i < lecture.length; i++) {
        let lecObj = lecture[i];
        let lecDepartments = lecture[i].departments;
        var departmentsData = [];
        for (let i = 0; i < lecDepartments.length; i++) {
          departmentsData.push(lecDepartments[i].name);
        }
        let obj = {
          id: lecObj._id,
          name: lecObj.name,
          credit: lecObj.credit,
          departments: departmentsData,
        };

        newObject.push(obj);
      }

      res.status(200).send(newObject);
    });
};

exports.getTotalCredits = (req, res) => {
  Lecture.find({ departments: { $all: [req.body.department] } })
    .populate("departments", "-__v")
    .exec((err, lecture) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      let totalCredit = 0;

      for (let i = 0; i < lecture.length; i++) {
        let lecObj = lecture[i];
        totalCredit = totalCredit + lecture[i].credit;
      }

      res.status(200).send({
        credit: totalCredit,
      });
    });
};
