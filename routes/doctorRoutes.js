const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const {
  getProfileController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
} = require("../controller/doctorCtrl");

router.post("/profile", authMiddleware, getProfileController);
router.post("/updateProfile", authMiddleware, updateProfileController);
router.post("/getDoctorById", authMiddleware, getDoctorByIdController);
router.post(
  "/doctor-appointments",
  authMiddleware,
  doctorAppointmentsController
);

router.post("/update-status", authMiddleware, updateStatusController);
module.exports = router;
