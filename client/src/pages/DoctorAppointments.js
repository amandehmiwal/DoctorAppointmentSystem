import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { Table, message } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const getAppointments = async () => {
    try {
      //dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/doctor/doctor-appointments",
        {
          token: localStorage.getItem("token"),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      //dispatch(hideLoading());

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

  const handleSuccess = async (record, status) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/doctor/update-status",
        {
          appointmentsId: record._id,
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
        getAppointments();
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Error");
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
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
      dataIndex: "phone",
      render: (text, record) => <span>{record.doctorInfo.phone}</span>,
    },
    {
      title: "Date & time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {record.date} <br></br>
          {record.time[0]} - {record.time[1]}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="flex">
          {record.status === "pending" && (
            <>
              <button
                className="px-2 py-1 text-white bg-green-600 border rounded text-medium"
                onClick={() => {
                  handleSuccess(record, "approved");
                }}
              >
                Approve
              </button>

              <button
                className="px-2 py-1 text-white bg-red-600 border rounded text-medium"
                onClick={() => {
                  handleSuccess(record, "rejected");
                }}
              >
                Reject
              </button>
            </>
          )}

          {record.status === "rejected" && (
            <>
              <button
                className="px-2 py-1 text-white bg-green-600 border rounded text-medium"
                onClick={() => {
                  handleSuccess(record, "approved");
                }}
              >
                Approve
              </button>
            </>
          )}

          {record.status === "approved" && (
            <>
              <button
                className="px-2 py-1 text-white bg-red-600 border rounded text-medium"
                onClick={() => {
                  handleSuccess(record, "rejected");
                }}
              >
                Reject
              </button>
            </>
          )}
        </div>
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

export default DoctorAppointments;
