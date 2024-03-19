const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
  profileController,
  OTPController,
  verifyOTPController,
  cancelAppointmentController,
  changePasswordController,
} = require("../controller/userCtrl");

router.post("/login", loginController);
router.post("/sendOTP", OTPController);
router.post("/verifyOTP", verifyOTPController);
router.post("/register", registerController);
router.post("/changePassword", changePasswordController);
//auth || POST
router.post("/getUserData", authMiddleware, authController);

//apply doctor || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController);

//notification || POST
router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

router.post("/getAllDoctors", authMiddleware, getAllDoctorsController);

router.post("/book-appointment", authMiddleware, bookAppointmentController);

router.post(
  "/book-availability",
  authMiddleware,
  bookingAvailabilityController
);

router.post("/user-appointments", authMiddleware, userAppointmentsController);

router.post("/profile", authMiddleware, profileController);
router.post("/cancel-appointment", authMiddleware, cancelAppointmentController);

module.exports = router;
