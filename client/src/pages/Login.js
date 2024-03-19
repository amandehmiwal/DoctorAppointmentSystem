import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();

  //to be included during using redux
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onFinishHandler = async (values) => {
    try {
      //dispatch
      dispatch(showLoading());

      const res = await axios.post("/api/v1/user/login", values);

      //dispatch
      dispatch(hideLoading());

      if (res.data.success) {
        //token is stored in local storage
        await localStorage.setItem("token", res.data.token);

        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      //dispatch
      dispatch(hideLoading());
      if (err.response.status === 401 || 403)
        message.error(err.response.data.message);
      else message.error("Something went wrong");
      //imp
      console.log(err.response.data.message);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center h-screen bg-blue-200 form-container">
        <Form
          layout="vertical"
          onFinish={onFinishHandler}
          className="p-4 border w-3/8 bg-slate-50"
        >
          <h1 className="py-5 text-4xl text-center">Login Form</h1>

          <Form.Item label="Email" name="email">
            <Input type="email" required placeholder="Your email" />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input.Password
              placeholder="input password"
              type="password"
              visibilityToggle={{
                visible: passwordVisible,
                onVisibleChange: setPasswordVisible,
              }}
              required
            />
          </Form.Item>

          <div className="flex flex-col">
            <Link
              to="/verifyEmail?newRegister=false"
              className="m-2 text-blue-400"
            >
              Forgot Password??
            </Link>
            <Link
              to="/verifyEmail?newRegister=true"
              className="m-2 text-blue-400"
            >
              Not registered? Register from here
            </Link>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-blue-400 border rounded roundedbg-blue-500 hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Login;
