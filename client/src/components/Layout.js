import React from "react";
import "../styles/Layout.css";
import { userMenu, adminMenu, doctorMenu } from "../Data/Data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message, Badge } from "antd";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  //get user details part
  const { user } = useSelector((state) => state.user);
  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  const isAdmin = user?.isAdmin;
  const isDoctor = user?.isDoctor;
  const isUser = !(isAdmin || isDoctor);
  const handleLogout = () => {
    localStorage.clear();
    message.success("logged out successfully");
  };
  return (
    <>
      <div className="h-screen p-2.5 main">
        <div className="flex layout">
          <div className="min-h-full mr-5 text-white bg-red-900 rounded sidebar w-80">
            <div className="my-5 text-2xl font-semibold text-center logo">
              logo
            </div>
            <hr></hr>
            <div className="mt-10 menu">
              {SidebarMenu.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <>
                    <div className={`menu-item ${isActive && "active"} mt-7`}>
                      <i className={menu.icon}></i>
                      <Link to={menu.path}>{menu.name}</Link>
                    </div>
                  </>
                );
              })}

              <div className={`menu-item mt-7`} onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <Link to="/login">Logout</Link>
              </div>
            </div>
          </div>
          <div className="w-full h-full content">
            <div className="header mb-2.5 bg-white">
              <div className="flex items-center justify-end h-16 gap-2 mx-4 header-content">
                <Badge
                  count={user && user.notification.length}
                  onClick={() => {
                    navigate("/notification");
                  }}
                  className="cursor-pointer"
                >
                  <i className="fa-solid fa-bell" />
                </Badge>
                {isAdmin && <Link to="/user/profile">{user?.name}</Link>}
                {isDoctor && (
                  <Link to="/doctor/profile/`{user?._id}`">{user?.name}</Link>
                )}
                {isUser && <Link to="/user/profile">{user?.name}</Link>}
              </div>
            </div>
            <div className="body mb-2.5 bg-white"> {children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
