const { authJwt } = require("../middlewares");
const controller = require("../controllers/lectures.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/lecture/add", [authJwt.verifyToken], controller.addLecture);
  app.get("/api/allLecture", controller.allLectures);
  app.get(
    "/api/departmentLecture",
    [authJwt.verifyToken],
    controller.departmentLectures
  );
  app.get(
    "/api/alldepartments",
    [authJwt.verifyToken],
    controller.allDepartments
  );

  app.post("/api/getFaculties", controller.getLecturesPerDepartment);
  app.post("/api/getTotalCredits", controller.getTotalCredits);
};
