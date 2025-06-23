import { useRef, useState } from "react";
import "./Profile.css";

function Profile() {
  const [image, setImage] = useState("https://picsum.photos/id/22/150/250");
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="profile-page p-4">
      <h1 className="text-center text-light fw-bolder profile-title mb-5">
        My Profile
      </h1>
      <div className="d-flex justify-content-center gap-5 mb-5">
        <div className="me-5">
          <div className="fs-4 fw-bold mb-3">
            <span className="info-label">First Name: </span> <span className="ms-2 info-input">Faig</span>
          </div>
          <div className="fs-4 fw-bold mb-3">
            <span className="info-label">Last Name: </span> <span className="ms-2 info-input">Suleymanov</span>
          </div>
          <div className="fs-4 fw-bold mb-3">
            <span className="info-label">Email: </span> <span className="ms-2 info-input">faig@gmail.com</span>
          </div>
          <div className="fs-4 fw-bold mb-3">
            <span className="info-label">Username: </span> <span className="ms-2 info-input">faig557</span>
          </div>
          <div className="fs-4 fw-bold mb-5">
            <span className="info-label">Address: </span> <span className="ms-2 info-input">123 Street, Philadelphia, PA 19000</span>
          </div>
          <div className="d-flex gap-3">
            <button className="btn button-profile">Update Profile</button>
            <button className="btn button-profile">Change Password</button>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center ms-4">
          <div
            className="profile-image-container position-relative"
            style={{ cursor: "pointer", width: 150, height: 250 }}
            onClick={handleImageClick}
          >
            <img
              className="profile-image"
              src={image}
              alt="Profile"
            />
            <div className="profile-image-overlay d-flex justify-content-center align-items-center">
              Change
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;