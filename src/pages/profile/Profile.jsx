import { useEffect, useRef, useState } from "react";
import "./Profile.css";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import { ALL_COUNTRIES } from "../../constants/countries";
import Glass from "../../components/glass/Glass";

function Profile({ id }) {
  const [image, setImage] = useState("https://picsum.photos/id/203/150/250");
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
  });
  const fileInputRef = useRef(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { store, dispatch } = useGlobalStore();

  const handleUpdate = async (e) => {
    e.preventDefault();

    const body = {
      user_id: store.user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      username: user.username,
      address: user.address,
      city: user.city,
      state: user.state,
      zip_code: user.zip_code,
      country: user.country,
    };

    // Add your API call here
    console.log("Update data:", body);

    setUser({
      first_name: "",
      last_name: "",
      email: "",
      username: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
    });
  };

  const getUser = async (id) => {
    setUser({
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      username: "johndoe",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zip_code: "10001",
      country: "US",
    });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    const body = {
      user_id: store.user.user_id,
      current_password: passwordData.currentPassword,
      new_password: passwordData.newPassword,
    };

    // Add password change API call here
    console.log("Password change data:", body);

    // Reset form after submission
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  useEffect(() => {
    getUser(id);
  }, [id]);

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
    <>
      <div
        className="modal fade"
        id={`editModal-${id}`}
        tabIndex="-1"
        aria-labelledby={`editModalLabel-${id}`}
        aria-hidden="true"
        data-bs-backdrop="true"
        data-bs-keyboard="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content profile-modal">
            <div className="modal-header">
              <h1
                className="modal-title fs-4 fw-bold text-white"
                id={`editModalLabel-${id}`}
              >
                Update Profile
              </h1>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={handleUpdate}
                className="row g-3 needs-validation"
                noValidate
              >
                <div className="col-md-6">
                  <label htmlFor={`firstName-${id}`} className="form-label">
                    First Name
                  </label>
                  <input
                    onChange={(e) =>
                      setUser({ ...user, first_name: e.target.value })
                    }
                    type="text"
                    className="form-control custom-input"
                    id={`firstName-${id}`}
                    value={user?.first_name}
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>

                <div className="col-md-6">
                  <label htmlFor={`lastName-${id}`} className="form-label">
                    Last Name
                  </label>
                  <input
                    onChange={(e) =>
                      setUser({ ...user, last_name: e.target.value })
                    }
                    type="text"
                    className="form-control custom-input"
                    id={`lastName-${id}`}
                    value={user?.last_name}
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>

                <div className="col-md-6">
                  <label htmlFor={`username-${id}`} className="form-label">
                    Username
                  </label>
                  <input
                    onChange={(e) =>
                      setUser({ ...user, username: e.target.value })
                    }
                    type="text"
                    className="form-control custom-input"
                    id={`username-${id}`}
                    value={user?.username}
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>

                <div className="col-md-6">
                  <label htmlFor={`email-${id}`} className="form-label">
                    Email
                  </label>
                  <input
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    type="email"
                    className="form-control custom-input"
                    id={`email-${id}`}
                    value={user?.email}
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                </div>

                <div className="col-md-12">
                  <label htmlFor={`address-${id}`} className="form-label">
                    Address
                  </label>
                  <div className="input-group has-validation">
                    <input
                      onChange={(e) =>
                        setUser({ ...user, address: e.target.value })
                      }
                      value={user?.address}
                      type="text"
                      className="form-control custom-input"
                      id={`address-${id}`}
                      aria-describedby="inputGroupPrepend"
                      required
                    />
                    <div className="invalid-feedback">
                      Please add your address.
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <label htmlFor={`city-${id}`} className="form-label">
                    City
                  </label>
                  <input
                    onChange={(e) => setUser({ ...user, city: e.target.value })}
                    value={user?.city}
                    type="text"
                    className="form-control custom-input"
                    id={`city-${id}`}
                    required
                  />
                  <div className="invalid-feedback">Please add your city.</div>
                </div>

                <div className="col-md-6">
                  <label htmlFor={`state-${id}`} className="form-label">
                    State
                  </label>
                  <input
                    onChange={(e) =>
                      setUser({ ...user, state: e.target.value })
                    }
                    value={user?.state}
                    type="text"
                    className="form-control custom-input"
                    id={`state-${id}`}
                    required
                  />
                  <div className="invalid-feedback">Please add your state.</div>
                </div>

                <div className="col-md-6">
                  <label htmlFor={`zipCode-${id}`} className="form-label">
                    Zip Code
                  </label>
                  <input
                    onChange={(e) =>
                      setUser({ ...user, zip_code: e.target.value })
                    }
                    value={user?.zip_code}
                    type="text"
                    className="form-control custom-input"
                    id={`zipCode-${id}`}
                    required
                  />
                  <div className="invalid-feedback">
                    Please provide a valid zip.
                  </div>
                </div>

                <div className="col-md-6">
                  <label htmlFor={`country-${id}`} className="form-label">
                    Country
                  </label>
                  <select
                    id={`country-${id}`}
                    className="form-select custom-input"
                    value={user?.country}
                    onChange={(e) =>
                      setUser({ ...user, country: e.target.value })
                    }
                  >
                    <option value="">Select Country</option>
                    {ALL_COUNTRIES.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>
                <hr />

                <div className="d-flex justify-content-center gap-3 p-1 mt-0">
                  <button
                    data-bs-dismiss="modal"
                    type="submit"
                    className="custom-button col-4"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="cancel-button col-4"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <div
        className="modal fade"
        id={`passwordModal-${id}`}
        tabIndex="-1"
        aria-labelledby={`passwordModalLabel-${id}`}
        aria-hidden="true"
        data-bs-backdrop="true"
        data-bs-keyboard="true"
      >
        <div className="modal-dialog">
          <div className="modal-content profile-modal">
            <div className="modal-header">
              <h1
                className="modal-title fs-4 fw-bold text-white"
                id={`passwordModalLabel-${id}`}
              >
                Change Password
              </h1>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={handlePasswordChange}
                className="row g-3 needs-validation"
                noValidate
              >
                <div className="col-md-12">
                  <label
                    htmlFor={`currentPassword-${id}`}
                    className="form-label"
                  >
                    Current Password
                  </label>
                  <input
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    type="password"
                    className="form-control custom-input"
                    id={`currentPassword-${id}`}
                    value={passwordData.currentPassword}
                    required
                  />
                  <div className="invalid-feedback">
                    Please enter your current password.
                  </div>
                </div>

                <div className="col-md-12">
                  <label htmlFor={`newPassword-${id}`} className="form-label">
                    New Password
                  </label>
                  <input
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    type="password"
                    className="form-control custom-input"
                    id={`newPassword-${id}`}
                    value={passwordData.newPassword}
                    required
                  />
                  <div className="invalid-feedback">
                    Please enter a new password.
                  </div>
                </div>

                <div className="col-md-12">
                  <label
                    htmlFor={`confirmPassword-${id}`}
                    className="form-label"
                  >
                    Confirm New Password
                  </label>
                  <input
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    type="password"
                    className="form-control custom-input"
                    id={`confirmPassword-${id}`}
                    value={passwordData.confirmPassword}
                    required
                  />
                  <div className="invalid-feedback">
                    Please confirm your new password.
                  </div>
                  {passwordData.newPassword &&
                    passwordData.confirmPassword &&
                    passwordData.newPassword !==
                      passwordData.confirmPassword && (
                      <div className="text-danger mt-1">
                        Passwords don't match!
                      </div>
                    )}
                </div>

                <hr />

                <div className="d-flex justify-content-center gap-3 p-0 mt-0">
                  <button
                    data-bs-dismiss="modal"
                    type="submit"
                    className="custom-button col-4 p-3"
                    disabled={
                      passwordData.newPassword !== passwordData.confirmPassword
                    }
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    className="cancel-button col-4"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>


      <div
        className="modal fade"
        id={`deleteModal-${id}`}
        tabIndex="-1"
        aria-labelledby={`deleteModalLabel-${id}`}
        aria-hidden="true"
        data-bs-backdrop="true"
        data-bs-keyboard="true"
      >
        <div className="modal-dialog">
          <div className="modal-content profile-modal">
            <div className="modal-header">
              <h3
                className="modal-title fs-5 fw-bold text-white"
                id={`deleteModalLabel-${id}`}
              >
                Are sure you want to delete your account?
              </h3>
              
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={handlePasswordChange}
                className="row g-3 needs-validation"
                noValidate
              >

                <div className="d-flex justify-content-center gap-5 p-1">
                  <button
                    data-bs-dismiss="modal"
                    type="submit"
                    className="custom-button col-4 py-0"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="cancel-button col-4"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-page d-flex justify-content-center py-5">
        <Glass>
          <h2 className="text-center text-light fw-bolder profile-title mb-3">
            My Profile
          </h2>
          <hr />
          <div className="d-flex justify-content-center align-items-center gap-4 mb-3">

            <div className="d-flex flex-column align-items-center gap-4 me-5">
            <div
              className="profile-image-container position-relative mb-2"
              onClick={handleImageClick}
            >
              <img className="profile-image" src={image} alt="Profile" />
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
          

            <div className="d-flex flex-column gap-4 mt-5">
                <button
                  className="button-profile"
                  onClick={() => getUser(id)}
                  data-bs-toggle="modal"
                  data-bs-target={`#editModal-${id}`}
                >
                  Update Profile
                </button>

                <button
                  className="button-profile"
                  data-bs-toggle="modal"
                  data-bs-target={`#passwordModal-${id}`}
                >
                  Change Password
                </button>
              </div>

               <div> <button className="btn btn-outline-danger border-1 rounded rounded-4 px-3"
            data-bs-toggle="modal"
            data-bs-target={`#deleteModal-${id}`}
            >Delete Account</button></div>

            </div>

            

            <div className="ms-3">
              <div className="fs-4 fw-bold mb-2">
                <span className="info-label">First Name: </span>{" "}
                <span className="ms-2 info-input">
                  {user.first_name || "Name"}
                </span>
              </div>
              <div className="fs-4 fw-bold mb-2">
                <span className="info-label">Last Name: </span>{" "}
                <span className="ms-2 info-input">
                  {user.last_name || "Lastname"}
                </span>
              </div>
              <div className="fs-4 fw-bold mb-2">
                <span className="info-label">Email: </span>{" "}
                <span className="ms-2 info-input">
                  {user.email || "name@email.com"}
                </span>
              </div>
              <div className="fs-4 fw-bold mb-2">
                <span className="info-label">Username: </span>{" "}
                <span className="ms-2 info-input">
                  {user.username || "name555"}
                </span>
              </div>
                   <div className="fs-4 fw-bold mb-2">
                <span className="info-label">Address: </span>{" "}
                <span className="ms-2 info-input">
                  {user.address || "address"}
                </span>
              </div>
                   <div className="fs-4 fw-bold mb-2">
                <span className="info-label">City: </span>{" "}
                <span className="ms-2 info-input">
                  {user.city || "ciry"}
                </span>
              </div>
                   <div className="fs-4 fw-bold mb-2">
                <span className="info-label">State: </span>{" "}
                <span className="ms-2 info-input">
                  {user.state || "state"}
                </span>
              </div>
                   <div className="fs-4 fw-bold mb-2">
                <span className="info-label">Zip Code: </span>{" "}
                <span className="ms-2 info-input">
                  {user.zip_code || "zip code"}
                </span>
              </div>
                   <div className="fs-4 fw-bold mb-2">
                <span className="info-label">Country: </span>{" "}
                <span className="ms-2 info-input">
                  {user.country || "country"}
                </span>
              </div>
              
            </div>
          </div>
        </Glass>
      </div>
    </>
  );
}

export default Profile;
