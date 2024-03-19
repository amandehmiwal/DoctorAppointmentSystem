import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DoctorsList = ({ doctor }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  return (
    <>
      <div
        className="m-2 border rounded !(user.isDoctor || user.isAdmin)?cursor-pointer card"
        onClick={() =>
          !(user.isDoctor || user.isAdmin)
            ? navigate(`/doctor/book-appointment/${doctor._id}`)
            : null
        }
      >
        <div className="card-header">
          Dr. {doctor.firstName} {doctor.lastName}
        </div>
        <div className="card-body">
          <div>
            <span className="text-medium">Specialization</span>
            <span> {doctor.specialization} </span>
          </div>

          <div>
            <span className="text-medium">Experience</span>
            <span> {doctor.experience} </span>
          </div>

          <div>
            <span className="text-medium">Fees / consultation</span>
            <span> {doctor.feesPerConsultation} </span>
          </div>

          <div>
            <span className="text-medium">Timings</span>
            <span>
              {" "}
              {doctor.timing[0]} - {doctor.timing[1]}{" "}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorsList;
