import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Input, Form, TimePicker, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "./../../redux/features/alertSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getDoctorInfoHandle = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/profile",
        { userId: params.id, token: localStorage.getItem("token") },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
      } else console.log(`${res.data.message}`);
    } catch (error) {
      message.error("error");
      console.log(`error in getDoctorInfoHandle ${error}`);
    }
  };

  //update-doctor-profile
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());

      const res = await axios.post(
        "/api/v1/doctor/updateProfile",
        {
          ...values,
          timing: values.timing.map((timestamp) => {
            const hours = String(timestamp.$d.getHours()).padStart(2, "0");
            const minutes = String(timestamp.$d.getMinutes()).padStart(2, "0");

            // Format the time as HH:mm
            const formattedTime = `${hours}:${minutes}`;

            return formattedTime;
          }),
          userId: user._id,
          token: localStorage.getItem("token"),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log(values);
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate(`/doctor/profile/${params.id}`);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error("error");
      console.log(`error in handleFinish ${error}`);
    }
  };

  useEffect(() => {
    getDoctorInfoHandle();
  }, []);
  return (
    <Layout>
      <h1 className="p-2 text-2xl font-bold text-center">My Profile</h1>

      {doctor && (
        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            ...doctor,
            timing: [],
          }}
        >
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
              Update
            </button>
          </div>
        </Form>
      )}
    </Layout>
  );
};

export default Profile;
