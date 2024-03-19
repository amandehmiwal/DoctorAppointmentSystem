import React from "react";
import Layout from "./../components/Layout";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { DatePicker, TimePicker, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const BookingPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [doctor, setDoctor] = useState([]);
  const [date, setDate] = useState();
  const [time, setTime] = useState([]);
  const [isAvailable, setIsAvailable] = useState();
  const { user } = useSelector((state) => state.user);

  //get doctor data
  const getDoctorData = async () => {
    try {
      //  dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId, token: localStorage.getItem("token") },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      // dispatch(hideLoading());
      setDoctor(res.data.data);
    } catch (err) {
      // dispatch(hideLoading());
      console.log(err);
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  const handleBooking = async () => {
    try {
      dispatch(showLoading());
      setIsAvailable(true);
      if (!date && !time) return alert("Date and time required");

      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
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
      } else message.error(res.data.message);
    } catch (err) {
      dispatch(hideLoading());
      console.log(err);
      message.error("error");
    }
  };

  const handleAvailability = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-availability",
        {
          doctorId: params.doctorId,
          date: date,
          time: time,
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
        console.log(`availability ${isAvailable}`);
        setIsAvailable(true);
        console.log(`availability ${isAvailable}`);
        message.success(res.data.message);
      } else message.error(res.data.message);
    } catch (err) {
      dispatch(hideLoading());
      console.log(err);
      message.error("error");
    }
  };

  return (
    <Layout>
      <h4 className="text-center">Booking Page</h4>
      <div className="container">
        {doctor && (
          <>
            <h1 className="">
              Dr. {doctor.firstName} {doctor.lastName}
            </h1>
            <div>
              <span className="text-medium">Fees / consultation : Rs.</span>
              <span> {doctor.feesPerConsultation} </span>
            </div>
            <div>
              <span className="text-medium">Timings</span>
              {doctor.timing && doctor.timing.length > 0 && (
                <span>
                  {doctor.timing[0]} - {doctor.timing[1]}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <DatePicker
                format="DD-MM-YYYY"
                onChange={(value) => {
                  // setIsAvailable(false);
                  setDate(value);
                }}
              />
              <TimePicker.RangePicker
                format="HH:mm"
                onChange={(value) => {
                  // setIsAvailable(false);
                  setTime(value);
                }}
              />
              <button
                className="px-2 py-1 text-white bg-blue-700 border rounded"
                onClick={handleAvailability}
              >
                Check Availability
              </button>

              {
                <button
                  className="px-2 py-1 text-white border rounded bg-slate-600"
                  onClick={handleBooking}
                >
                  Book Now
                </button>
              }
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
