const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
  BlockUserController,
  UnblockUserController,
} = require("../controller/adminCtrl");

router.post("/get-all-users", authMiddleware, getAllUsersController);

router.post("/get-all-doctors", authMiddleware, getAllDoctorsController);

router.post(
  "/change-account-status",
  authMiddleware,
  changeAccountStatusController
);
router.post("/blockUser", authMiddleware, BlockUserController);

router.post("/unblockUser", authMiddleware, UnblockUserController);
module.exports = router;
