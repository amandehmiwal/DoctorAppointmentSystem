import React from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, message } from "antd";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import axios from "axios";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/profile",
        { userId: user._id, ...values },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(`error in handle finish`);
      message.error("Something went wrong");
    }
  };
  return (
    <Layout>
      <h1 className="p-2 text-2xl font-bold text-center">My Profile</h1>

      {user && (
        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ ...user }}
        >
          <div className="flex flex-col gap-4 ">
            <Form.Item label="Name" name="name">
              <Input type="text"></Input>
            </Form.Item>

            <Form.Item label="email" name="email">
              <Input type="text"></Input>
            </Form.Item>

            <div>
              <button
                className="px-2 py-1 m-1 text-lg text-white bg-blue-700 border rounded "
                type="submit"
              >
                Update
              </button>
            </div>
          </div>
        </Form>
      )}
    </Layout>
  );
};

export default UserProfile;
