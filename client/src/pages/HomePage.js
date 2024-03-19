import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Row, message } from "antd";
import DoctorsList from "../components/DoctorsList";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState([]);
  //get doctor data
  const getDoctorsData = async () => {
    try {
      //dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/getAllDoctors",
        { token: localStorage.getItem("token") },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      //  dispatch(hideLoading());
      setDoctors(res.data.data);
    } catch (err) {
      // dispatch(hideLoading());
      console.log(err);
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  return (
    <Layout>
      <h1>Doctors List</h1>
      <Row className="">
        {doctors && doctors.map((doctor) => <DoctorsList doctor={doctor} />)}
      </Row>
    </Layout>
  );
};

export default HomePage;
