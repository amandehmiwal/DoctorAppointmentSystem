const userModel = require("../models/userModels");
const doctorModel = require("../models/doctorModel");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({ isAdmin: { $ne: true } });
    res.status(200).send({
      success: true,
      message: `users fetched`,
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: `Error in getAllUsersController`,
    });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({
      success: true,
      message: `doctors fetched`,
      data: doctors,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: `Error in getAllDoctorsController`,
    });
  }
};

const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;

    const doctor = await doctorModel.findByIdAndUpdate(
      doctorId,
      { status },
      { new: true }
    );
    const user = await userModel.findById(doctor.userId);
    const notification = user.notification;
    notification.push({
      type: `doctor-account-request-updated`,
      message: `Your doctor account has been ${status}`,
      onClickPath: "/notification",
    });
    await doctor.save();

    if (doctor.status === "approved") {
      user.isDoctor = true;
    } else {
      user.isDoctor = false;
    }

    await user.save();
    res.status(200).send({
      success: true,
      message: `Doctor request updated`,
      data: doctor,
    });
  } catch (error) {
    console.log(`error in changeAccountStatusController ${error} `);
    res.status(500).send({
      success: false,
      error,
      message: `error in changeAccountStatusController`,
    });
  }
};

const BlockUserController = async (req, res) => {
  try {
    const userId = req.body.blockUserId;
    const doctor = await doctorModel.findOne({ userId });
    if (doctor) {
      doctor.isBlocked = true;
      await doctor.save();
    }
    const user = await userModel.findById(userId);
    user.isBlocked = true;
    await user.save();
    res.status(200).send({
      success: true,
      message: `User blocked successfully`,
    });
  } catch (error) {
    console.log(`error in BlockUserController `);
    res.status(504).send({
      success: false,
      error,
      message: `error in BlockUserController`,
    });
  }
};

const UnblockUserController = async (req, res) => {
  try {
    const userId = req.body.unblockUserId;
    const doctor = await doctorModel.findOne({ userId });
    if (doctor) {
      doctor.isBlocked = false;
      await doctor.save();
    }
    const user = await userModel.findById(userId);
    user.isBlocked = false;
    await user.save();

    res.status(200).send({
      success: true,
      message: `User unblocked successfully`,
    });
  } catch (error) {
    console.log(`error in UnblockUserController `);
    res.status(504).send({
      success: false,
      error,
      message: `error in UnblockUserController`,
    });
  }
};
module.exports = {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
  BlockUserController,
  UnblockUserController,
};
