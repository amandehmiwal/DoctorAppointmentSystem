import React from "react";
import Layout from "../components/Layout";
import { Input, Form, TimePicker, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";

const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());

      const res = await axios.post(
        "/api/v1/user/apply-doctor",
        {
          ...values,
          email: user.email,

          timing: values.timing.map((timestamp) => {
            const hours = String(timestamp.$d.getHours()).padStart(2, "0");
            const minutes = String(timestamp.$d.getMinutes()).padStart(2, "0");

            // Format the time as HH:mm
            const formattedTime = `${hours}:${minutes}`;

            return formattedTime;
          }),

          userId: user._id,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error("Something went wrong");
      console.log(error);
      // Axios error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
      console.error("Error config:", error.config);
    }
  };

  return (
    <Layout>
      <h1 className="p-2 text-2xl font-medium text-center">Apply for Doctor</h1>

      <Form layout="vertical" onFinish={handleFinish}>
        <h6 className="p-2 text-lg text-green-500">Personal details</h6>

        <div className="grid grid-cols-3 gap-4 ">
          <Form.Item
            label="First Name"
            name="firstName"
            required
            rules={[{ required: true }]}
          >
            <Input type="text" placeholder="your first name"></Input>
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            required
            rules={[{ required: true }]}
          >
            <Input type="text" placeholder="your last name"></Input>
          </Form.Item>

          <Form.Item
            label="Phone number"
            name="phone"
            required
            rules={[{ required: true }]}
          >
            <Input type="text" placeholder="your contact number"></Input>
          </Form.Item>

          <Form.Item label="website (if any)" name="website">
            <Input type="text" placeholder="your website"></Input>
          </Form.Item>

          <Form.Item
            label="address"
            name="address"
            required
            rules={[{ required: true }]}
          >
            <Input type="text" placeholder="your address"></Input>
          </Form.Item>
        </div>

        <h6 className="p-4 text-lg text-green-500">Professional details</h6>

        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            label="Specialization"
            name="specialization"
            required
            rules={[{ required: true }]}
          >
            <Input type="text" placeholder="your specialization"></Input>
          </Form.Item>

          <Form.Item
            label="Experience"
            name="experience"
            required
            rules={[{ required: true }]}
          >
            <Input type="text" placeholder="your experience"></Input>
          </Form.Item>

          <Form.Item
            label="Fees Per Consultation"
            name="feesPerConsultation"
            required
            rules={[{ required: true }]}
          >
            <Input type="text" placeholder="your fees"></Input>
          </Form.Item>

          <Form.Item
            label="Timings"
            name="timing"
            required
            rules={[{ required: true }]}
          >
            <TimePicker.RangePicker format="HH:mm" />
          </Form.Item>
        </div>

        <div>
          <button
            className="px-2 py-1 m-1 text-lg text-white bg-blue-700 border rounded "
            type="submit"
          >
            Submit
          </button>
        </div>
      </Form>
    </Layout>
  );
};
export default ApplyDoctor;
