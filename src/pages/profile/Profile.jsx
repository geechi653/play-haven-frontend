import { useEffect, useRef, useState } from "react";
import "./Profile.css";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import { ALL_COUNTRIES } from "../../constants/countries";

function Profile({ id }) {
  const [image, setImage] = useState("https://picsum.photos/id/22/150/250");
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
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
  };

  const getUser = async (id) => {};

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
    <div className="profile-page p-4">
      <h1 className="text-center text-light fw-bolder profile-title mb-5">
        My Profile
      </h1>
      <div className="d-flex justify-content-center gap-5 mb-5">
        <div className="me-5">
          <div className="fs-4 fw-bold mb-3">
            <span className="info-label">First Name: </span>{" "}
            <span className="ms-2 info-input">Name</span>
          </div>
          <div className="fs-4 fw-bold mb-3">
            <span className="info-label">Last Name: </span>{" "}
            <span className="ms-2 info-input">Lastname</span>
          </div>
          <div className="fs-4 fw-bold mb-3">
            <span className="info-label">Email: </span>{" "}
            <span className="ms-2 info-input">name@email.com</span>
          </div>
          <div className="fs-4 fw-bold mb-3">
            <span className="info-label">Username: </span>{" "}
            <span className="ms-2 info-input">name555</span>
          </div>
          <div className="fs-4 fw-bold mb-5">
            <span className="info-label">Address: </span>{" "}
            <span className="ms-2 info-input">
              123 Street, City, State 00000
            </span>
          </div>
          <div className="d-flex gap-3">
            <button
              className="button-profile"
              onClick={() => getUser(id)}
              data-bs-toggle="modal"
              data-bs-target={`#editModal-${id}`}
            >
              Update Profile
            </button>

            <div
              className="modal fade"
              id={`editModal-${id}`}
              tabIndex="-1"
              aria-labelledby={`editModalLabel-${id}`}
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content profile-modal">
                  <div className="modal-header">
                    <h1
                      className="modal-title fs-4 fw-bold text-white"
                      id={`#editModalLabel-${id}`}
                    >
                      Update Profile
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
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
                        <label
                          htmlFor="validationCustom01"
                          className="form-label"
                        >
                          First Name
                        </label>
                        <input
                          onChange={(e) =>
                            setUser({ ...user, first_name: e.target.value })
                          }
                          type="text"
                          className="form-control custom-input"
                          id="validationCustom01"
                          value={user?.first_name}
                          required
                        />
                        <div className="valid-feedback">Looks good!</div>
                      </div>

                      <div className="col-md-6">
                        <label
                          htmlFor="validationCustom01"
                          className="form-label"
                        >
                          Last Name
                        </label>
                        <input
                          onChange={(e) =>
                            setUser({ ...user, last_name_name: e.target.value })
                          }
                          type="text"
                          className="form-control custom-input"
                          id="validationCustom01"
                          value={user?.last_name}
                          required
                        />
                        <div className="valid-feedback">Looks good!</div>
                      </div>

                      <div className="col-md-6">
                        <label
                          htmlFor="validationCustom01"
                          className="form-label"
                        >
                          Username
                        </label>
                        <input
                          onChange={(e) =>
                            setUser({ ...user, username: e.target.value })
                          }
                          type="text"
                          className="form-control custom-input"
                          id="validationCustom01"
                          value={user?.username}
                          required
                        />
                        <div className="valid-feedback">Looks good!</div>
                      </div>

                      <div className="col-md-6">
                        <label
                          htmlFor="validationCustom02"
                          className="form-label"
                        >
                          Email
                        </label>
                        <input
                          onChange={(e) =>
                            setContact({ ...user, email: e.target.value })
                          }
                          type="email"
                          className="form-control custom-input"
                          id="validationCustom02"
                          value={user?.email}
                          required
                        />
                        <div className="valid-feedback">Looks good!</div>
                      </div>

                      <div className="col-md-12">
                        <label
                          htmlFor="validationCustomUsername"
                          className="form-label"
                        >
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
                            id="validationCustomUsername"
                            aria-describedby="inputGroupPrepend"
                            required
                          />
                          <div className="invalid-feedback">
                            Please add a phone number.
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label
                          htmlFor="validationCustom03"
                          className="form-label"
                        >
                          City
                        </label>
                        <input
                          onChange={(e) =>
                            setUser({ ...user, city: e.target.value })
                          }
                          value={user?.city}
                          type="text"
                          className="form-control custom-input"
                          id="validationCustom03"
                          required
                        />
                        <div className="invalid-feedback">
                          Please provide a valid street.
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label
                          htmlFor="validationCustom03"
                          className="form-label"
                        >
                          State
                        </label>
                        <input
                          onChange={(e) =>
                            setContact({ ...user, state: e.target.value })
                          }
                          value={user?.state}
                          type="text"
                          className="form-control custom-input"
                          id="validationCustom03"
                          required
                        />
                        <div className="invalid-feedback">
                          Please provide a valid city.
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label
                          htmlFor="validationCustom05"
                          className="form-label"
                        >
                          Zip Code
                        </label>
                        <input
                          onChange={(e) =>
                            setUser({ ...user, zip_code: e.target.value })
                          }
                          value={user?.zip_code}
                          type="text"
                          className="form-control custom-input"
                          id="validationCustom05"
                          required
                        />
                        <div className="invalid-feedback">
                          Please provide a valid zip.
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="inputState" className="form-label">
                          Country
                        </label>
                        <select
                          id="inputState"
                          className="form-select custom-input"
                          value={user?.country}
                          onChange={(e) =>
                            setUserInput({ ...user, country: e.target.value })
                          }
                        >
                          <option value={user?.country}>{user?.country}</option>
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

            <button
              className="button-profile"
            >
              Change Password
            </button>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center ms-4">
          <div
            className="profile-image-container position-relative"
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
        </div>
      </div>
    </div>
  );
}

export default Profile;
