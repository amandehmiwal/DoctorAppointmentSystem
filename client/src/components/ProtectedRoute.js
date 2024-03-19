import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { setUser } from "../redux/features/userSlice";

function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const getUser = async () => {
    try {
      dispatch(showLoading());
      let token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token available");
      }

      const res = await axios.post(
        "/api/v1/user/getUserData",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(hideLoading());

      if (res.data.success) {
        dispatch(setUser(res.data.data));
      } else {
        localStorage.clear();
        throw new Error("Failed to get user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      dispatch(hideLoading());
      localStorage.clear();
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user]);

  if (localStorage.getItem("token")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
