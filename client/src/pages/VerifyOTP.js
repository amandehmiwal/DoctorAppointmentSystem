import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Form, Input, message } from "antd";
import axios from "axios";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const email = location.state.email || "";
  const newRegister = location.state.newRegister || false;

  const verifyOTPHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/verifyOTP", {
        ...values,
        email,
      });

      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        if (newRegister === "true")
          navigate("/register", { state: { email: email } });
        else navigate("/changePassword", { state: { email: email } });
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      if (error.response) {
        // Server responded with an error
        if (error.response.status === 401) {
          message.error("OTP is incorrect");
        } else {
          message.error("Something went wrong");
          console.log(
            "Error in sendOTP handler: " + error.response.data.message
          );
        }
      } else {
        // Network or client-side error
        message.error("Something went wrong");
        console.log("Network or client-side error: " + error.message);
      }
    }
  };
  return (
    <div className="flex items-center justify-center h-screen form-container">
      <Form
        layout="vertical"
        onFinish={verifyOTPHandler}
        className="p-4 border w-3/8"
      >
        <h1 className="py-5 text-4xl text-center">Enter OTP</h1>

        <Form.Item label="OTP" name="OTP" required>
          <Input type="text" required placeholder="Enter the OTP" />
        </Form.Item>

        <div>
          <Link
            to="/verifyEmail"
            className="px-4 py-2 m-2 font-bold text-white bg-blue-400 border rounded roundedbg-blue-500 hover:bg-blue-700 "
          >
            Back
          </Link>
          <button
            type="submit"
            className="px-4 py-2 font-bold text-white bg-blue-400 border rounded roundedbg-blue-500 hover:bg-blue-700"
          >
            Verify your OTP
          </button>
        </div>
      </Form>
    </div>
  );
};

export default VerifyOTP;
