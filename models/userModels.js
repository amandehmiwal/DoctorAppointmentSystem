const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is mandatory"],
  },

  email: {
    type: String,
    required: [true, "email is mandatory"],
  },

  password: {
    type: String,
    required: [true, "password is mandatory"],
  },

  //getting user details wali video
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },

  isDoctor: {
    type: Boolean,
    default: false,
  },

  notification: {
    type: Array,
    default: [],
  },

  seenNotification: {
    type: Array,
    default: [],
  },
});

//UserData is collection name in database
const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
