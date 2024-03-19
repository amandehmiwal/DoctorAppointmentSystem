import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { Space, Table } from "antd";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getDoctors = async () => {
    try {
      const res = await axios.post(
        "/api/v1/admin/get-all-doctors",
        { token: localStorage.getItem("token") },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccountStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/admin/change-account-status",
        {
          doctorId: record._id,
          status,
          token: localStorage.getItem("token"),
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
        navigate("/admin/doctors");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(`error in handleAccountStatus`);
      console.log(`error in handleAccountStatus  ${error}`);
    }
  };
  useEffect(() => {
    getDoctors();
  }, []);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (_, record) => (
        <Space size="middle">
          <span>
            {record.firstName} {record.lastName}
          </span>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle" className="flex">
          {record.status === "pending" ? (
            <button
              className="px-2 py-1 text-white bg-green-700"
              onClick={() => handleAccountStatus(record, "approved")}
            >
              Approve
            </button>
          ) : (
            <button
              className="px-2 py-1 text-white bg-red-700"
              onClick={() => handleAccountStatus(record, "rejected")}
            >
              Reject
            </button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="p-2 text-2xl font-bold text-center">Doctors List</h1>
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  );
};

export default Doctors;
