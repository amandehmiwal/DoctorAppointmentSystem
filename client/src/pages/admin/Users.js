import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { Space, Table, message } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";

const Users = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const getUsers = async () => {
    try {
      //dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/admin/get-all-users",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      //no dispatch here as it is useEffect   --- continuous
      //dispatch(hideLoading());
      if (res.data.success) {
        setUsers(res.data.data);
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
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
  useEffect(() => {
    getUsers();
  }, []);

  const handleBlockUser = async (blockUserId) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "../api/v1/admin/blockUser",
        { blockUserId: blockUserId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      } else message.error(res.data.message);
    } catch (error) {
      dispatch(hideLoading());
      // Axios error
      message.error("Something went wrong");
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

  const handleUnblockUser = async (unblockUserId) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "../api/v1/admin/unblockUser",
        { unblockUserId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      } else message.error(res.data.message);
    } catch (error) {
      dispatch(hideLoading());
      message.error("Something went wrong");
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

  {
    /* //antd table col  */
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Doctor",
      key: "isDoctor",
      render: (_, record) => (
        <Space size="middle">
          <a>{record.isDoctor ? "Yes" : "No"}</a>
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.isBlocked === false && (
            <a
              className="px-2 py-1 text-white bg-red-700"
              onClick={() => {
                handleBlockUser(record._id);
              }}
            >
              Block
            </a>
          )}
          {record.isBlocked && (
            <a
              className="px-2 py-1 text-white bg-blue-700"
              onClick={() => {
                handleUnblockUser(record._id);
              }}
            >
              Unblock
            </a>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="p-2 text-2xl font-bold text-center">Users List</h1>
      <Table columns={columns} dataSource={users} />
    </Layout>
  );
};

export default Users;
