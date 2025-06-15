import { Link } from "react-router";
import Glass from "../../components/glass/Glass";
import "./SignUp.css";
import { useState } from "react";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import { ALL_COUNTRIES } from "../../constants/countries";

function SignUp() {
  const { store, dispatch } = useGlobalStore();
  const [error, setError] = useState(false);
  const [userInputs, setUserInput] = useState({
    country: "",
    email: "",
    first_name: "",
    last_name: "",
    username: "",
    password: "",
  });

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const user = {
      country: userInputs.country,
      email: userInputs.email,
      first_name: userInputs.first_name,
      last_name: userInputs.last_name,
      username: userInputs.username,
      password: userInputs.password,
    };

    // api call
  };

  return (
    <div className="signup-container d-flex align-items-center justify-content-center py-4">
      <Glass>
        <form onSubmit={handleOnSubmit}>
          <h3 className="fw-bolder mb-3 text-center custom-text">
            Create Account
          </h3>

          <div className="mb-2 fw-bold">
            <select
              id="inputState"
              className="form-select rounded-4 custom-input"
              value={userInputs.country}
              onChange={(e) =>
                setUserInput({ ...userInputs, country: e.target.value })
              }
            >
              <option value="">Select a country...</option>
              {ALL_COUNTRIES.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2 fw-bold">
            <input
              type="email"
              className="form-control rounded-4 custom-input"
              id="inputEmail"
              placeholder="Email Address"
              onChange={(e) =>
                setUserInput({ ...userInputs, email: e.target.value })
              }
              value={userInputs.email}
            />
          </div>

          <div className="d-flex">
            <div className="mb-2 fw-bold col-6 pe-1">
              <input
                type="text"
                className="form-control rounded-4 custom-input"
                id="input-first-name"
                placeholder="First Name"
                onChange={(e) =>
                  setUserInput({ ...userInputs, first_name: e.target.value })
                }
                value={userInputs.first_name}
              />
            </div>

            <div className="mb-2 fw-bold col-6 ps-1">
              <input
                type="text"
                className="form-control rounded-4 custom-input"
                id="input-last-name"
                placeholder="Last Name"
                onChange={(e) =>
                  setUserInput({ ...userInputs, last_name: e.target.value })
                }
                value={userInputs.last_name}
              />
            </div>
          </div>

          <div className="mb-2 fw-bold">
            <input
              type="text"
              className="form-control rounded-4 custom-input"
              id="input-username"
              placeholder="Username"
              onChange={(e) =>
                setUserInput({ ...userInputs, username: e.target.value })
              }
              value={userInputs.username}
            />
          </div>

          <div className="mb-2 fw-bold">
            <input
              type="password"
              className="form-control rounded-4 custom-input"
              id="input-password"
              placeholder="Password"
              onChange={(e) =>
                setUserInput({ ...userInputs, password: e.target.value })
              }
              value={userInputs.password}
            />
          </div>

          {error ? (
            <>
              <p className="text-center text-danger fw-bold">
                Something wrong happened! Please try again...
              </p>
            </>
          ) : (
            <></>
          )}

          <p className="text-center fw-bold custom-text">
            Already have an account?{" "}
            <Link className="fw-bolder custom-text" to="/login">
              Login
            </Link>
          </p>

          <div className="mb-1">
            <button
              type="submit"
              className="btn custom-button fs-4 col-12 fw-bolder rounded-5"
            >
              Continue
            </button>
          </div>
        </form>
      </Glass>
    </div>
  );
}

export default SignUp;
