const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment-timezone");
const OTPModel = require("../models/OTPmodel");

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOneAndDelete({
      email: req.body.email,
    });
    const password = req.body.password;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    req.body.password = hashedPassword;

    const newUser = new userModel(req.body);
    await newUser.save();
    let token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    res.status(201).send({
      token,
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: `Register controller failed`,
      error: err,
    });
  }
};

const OTPController = async (req, res) => {
  try {
    const { email, newRegister } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser && newRegister === "true") {
      return res.status(400).send({
        success: false,
        message: "User already exists",
      });
    }
    if (!existingUser && newRegister === "false") {
      return res.status(400).send({
        success: false,
        message: "User not registered",
      });
    }
    if (existingUser && newRegister === "false" && existingUser.isBlocked) {
      return res.status(400).send({
        success: false,
        message: "User blocked",
      });
    }

    const speakeasy = require("speakeasy");

    // Generate a secret key with a length of 20 characters
    const secret = speakeasy.generateSecret({ length: 20 });

    // Generate a TOTP code using the secret key
    const code = speakeasy.totp({
      // Use the Base32 encoding of the secret key
      secret: secret.base32,

      // Tell Speakeasy to use the Base32 encoding format for the secret key
      encoding: "base32",
    });

    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "modernprofile12@gmail.com",
        pass: process.env.password,
      },
    });

    await transporter.sendMail({
      from: '"ChatApp👻" <modernprofile12@gmail.com>', // sender address
      to: req.body.email, // lison53@etist of receivers
      subject: "OTP", // Subject line
      html: `<b>Hello, OTP for registration is ${code}</b>`, // html body
    });

    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(code, salt);

    req.body.OTP = hashedOTP;

    const model = await OTPModel.findOneAndUpdate(
      { email },
      // Update
      { OTP: req.body.OTP },
      // Options
      {
        // If document doesn't exist, create a new one
        upsert: true,
        // Return the updated document
        returnOriginal: true,
      }
    );

    res.status(201).send({
      success: true,
      message: "OTP sent successfully to the email id",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: `OTP controller failed`,
      error: err,
    });
  }
};

const verifyOTPController = async (req, res) => {
  try {
    const OTP = req.body.OTP;
    const user = await OTPModel.findOne({ email: req.body.email });
    if (await bcrypt.compare(OTP, user.OTP)) {
      await user.deleteOne();
      res.status(200).send({
        success: true,
        message: "OTP verified",
      });
    } else {
      res.status(401).send({
        success: false,
        message: "OTP is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `verifyOTPController failed `,
      error,
    });
  }
};
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //find email in db
    const user = await userModel.findOne({ email, isBlocked: { $ne: true } });

    //if not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User or Password incorrect or user blocked`,
      });
    }

    //matching password
    if (await bcrypt.compare(password, user.password)) {
      //create a token
      //on the basis of id here
      let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      //user object mai token ke andar token send kar diya
      user.token = token;
      //user object se password hidden
      user.password = undefined;

      res.status(200).json({
        success: true,
        token,
        message: " User logged in successfully",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Email or Password incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Failure in loginController `,
      error,
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({
      _id: req.body.userId,
    });

    if (!user) {
      return res.status(200).send({
        success: false,
        message: `user not found`,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: `auth error`,
      error: err,
    });
  }
};

//apply-doctor controller
const applyDoctorController = async (req, res) => {
  try {
    let newRequest = false;
    let newDoctor = await doctorModel.findOneAndReplace(
      {
        userId: req.body.userId,
      },
      { ...req.body, status: "pending" }
    );
    //selecting all the data using ...req.body
    if (!newDoctor) {
      newRequest = true;
      newDoctor = await doctorModel({ ...req.body, status: "pending" });
      //saving the doctor data
      await newDoctor.save();
      //finding the admin
      const adminUser = await userModel.findOne({ isAdmin: true });
      //notifying the admin
      const notification = adminUser.notification;
      notification.push({
        type: `apply-doctor-request`,
        message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for doctor request`,
        data: {
          ...newDoctor,
          onClickPath: "/admin/doctor",
        },
      });

      await userModel.findByIdAndUpdate(adminUser._id, { notification });
    }
    if (newRequest) {
      res.status(201).send({
        success: true,
        message: `Applied successfully for ${newDoctor.firstName}`,
      });
    } else {
      res.status(201).send({
        success: true,
        message: `application updated for ${newDoctor.firstName}`,
      });
    }
  } catch (err) {
    console.log(`Error in doctor controller ${err}`);
    res.status(500).send({
      message: `Error in doctor controller `,
      success: false,
      error: err,
    });
  }
};

const changePasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    req.body.password = hashedPassword;

    const user = await userModel.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );
    // let token = jwt.sign({ id: user }, process.env.JWT_SECRET, {
    //   expiresIn: "2h",
    // });
    res.status(201).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: `error in changePasswordController `,
    });
  }
};

const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const notification = user.notification;
    user.notification = [];
    user.seenNotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: `all notifications marked as read`,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: `error in getAllNotificationController `,
    });
  }
};

const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.seenNotification = [];
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: `all notifications deleted`,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: `error in deleteAllNotificationController `,
    });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({
      status: "approved",
      isBlocked: { $ne: true },
    });
    res.status(200).send({
      success: true,
      message: `all doctors fetched`,
      data: doctors,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: `error in getAllController `,
    });
  }
};

const bookAppointmentController = async (req, res) => {
  try {
    // converting the date to IST zone and formatting in DD-MM-YYYY
    const dateString = req.body.date;
    const date = moment(dateString);
    // Convert to IST
    const istDate = date.tz("Asia/Kolkata");
    // Format IST date string
    const istDateString = istDate.format("DD-MM-YYYY");
    //saving in req.body
    req.body.date = istDateString;

    // converting the time to IST zone and formatting in HH:mm

    let timeString = req.body.time[0];
    let time = moment.utc(timeString);
    let istTime = time.tz("Asia/Kolkata");
    let formattedTime = istTime.format("HH:mm");

    timeString = req.body.time[1];
    time = moment.utc(timeString);
    istTime = time.tz("Asia/Kolkata");
    let formattedTime2 = istTime.format("HH:mm");

    //updating
    req.body.time = [formattedTime, formattedTime2];
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const doctor = await doctorModel.findById(req.body.doctorId);
    const user = await userModel.findById(doctor.userId);
    user.notification.push({
      type: "new-appointment-request",
      message: `A new appointment request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointment",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: `appointment booked successfully`,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: `error in bookAppointmentController `,
    });
  }
};

const bookingAvailabilityController = async (req, res) => {
  try {
    // converting the date to IST zone and formatting in DD-MM-YYYY
    const dateString = req.body.date;
    const date = moment(dateString);
    // Convert to IST
    const istDate = date.tz("Asia/Kolkata");
    // Format IST date string
    const istDateString = istDate.format("DD-MM-YYYY");
    //saving in req.body
    req.body.date = istDateString;

    // converting the time to IST zone and formatting in HH:mm

    let timeString = req.body.time[0];
    let time = moment.utc(timeString);
    let istTime = time.tz("Asia/Kolkata");
    let formattedTime = istTime.format("HH:mm");

    timeString = req.body.time[1];
    time = moment.utc(timeString);
    istTime = time.tz("Asia/Kolkata");
    let formattedTime2 = istTime.format("HH:mm");

    //updating
    req.body.time = [formattedTime, formattedTime2];
    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,
      date: req.body.date,
      time: {
        $gte: req.body.time[0],
        $lte: req.body.time[1],
      },
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        success: true,
        message: `not available`,
      });
    }
    res.status(200).send({
      success: true,
      message: `appointment available for the specific time`,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: `error in bookingAvailabilityController `,
    });
  }
};

const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });

    res.status(200).send({
      success: true,
      message: `user appointments fetched successfully`,
      data: appointments,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: `error in userAppointmentsController `,
    });
  }
};

const profileController = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.body.userId, req.body);
    res.status(200).send({
      success: true,
      message: "Your info updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: `error in profileController `,
    });
  }
};

const cancelAppointmentController = async (req, res) => {
  try {
    const appointment = await appointmentModel.findById(req.body.appId);
    const doctor = await doctorModel.findById(appointment.doctorId);
    const user = await userModel.findById(doctor.userId);
    user.notification.push({
      type: `Appointment cancelled`,
      message: `${appointment.userInfo["name"]} has cancelled their appointment scheduled on ${appointment.date} at ${appointment.time[0]}`,
      onClickPath: "/appointments",
    });
    await user.save();
    await appointment.deleteOne();
    res.status(200).send({
      success: true,
      message: "Your appointment is cancelled successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: `error in cancelAppointmentController `,
    });
  }
};

module.exports = {
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
};
