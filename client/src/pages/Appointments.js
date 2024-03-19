import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { Space, Table, message } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";

const Appointments = () => {
  const dispatch = useDispatch();
  const [appointments, setAppointments] = useState([]);
  const getAppointments = async () => {
    try {
      //dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/user-appointments",
        {
          token: localStorage.getItem("token"),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      // dispatch(hideLoading());

      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      // dispatch(hideLoading());
      console.log(error);
      message.error(`can't fetch`);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const handleCancelAppointment = async (appId) => {
    try {
      const res = await axios.post(
        "/api/v1/user/cancel-appointment",
        {
          token: localStorage.getItem("token"),
          appId,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.data.success) {
        message.success(res.data.message);
        getAppointments();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error(`can't cancel`);
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      render: (text, record) => <span>{record._id}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "doctorInfo.phone",
      render: (text, record) => <span>{record.doctorInfo.phone}</span>,
    },
    {
      title: "Date & time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {record.date}
          {record.time[0]}
          {record.time[1]}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.status != "rejected" && (
            <a
              className="px-2 py-1 text-white bg-red-700"
              onClick={() => {
                handleCancelAppointment(record._id);
              }}
            >
              Cancel
            </a>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="p-2 text-2xl text-center text-bold"> Appointment Lists</h1>
      <Table columns={columns} dataSource={appointments}></Table>
    </Layout>
  );
};

export default Appointments;
