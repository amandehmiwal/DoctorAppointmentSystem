const userModel = require("../models/userModels");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");

const getProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: `profile fetched`,
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: `Error in getProfileController`,
    });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(200).send({
      success: true,
      message: `profile updated`,
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: `Error in updateProfileController`,
    });
  }
};

const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.body.doctorId);
    res.status(200).send({
      success: true,
      message: `doctor fetched by id for booking`,
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Error in getDoctorByIdController`,
      error,
    });
  }
};

const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({
      doctorId: doctor._id,
    });

    res.status(200).send({
      success: true,
      message: `doctor appointments fetched`,
      data: appointments,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Error in doctorAppointmentsController`,
      error,
    });
  }
};

const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status }
    );

    const user = await userModel.findById(appointment.userId);
    user.notification.push({
      type: "appointment-request-updated",
      message: `appointment request updated`,
      onClickPath: "/doctor/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: `appointment status updated successfully`,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Error in updateStatusController`,
      error,
    });
  }
};

module.exports = {
  getProfileController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
};
