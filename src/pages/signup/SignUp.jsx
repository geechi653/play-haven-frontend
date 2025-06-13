import { Link } from "react-router";
import Glass from "../../components/glass/Glass";
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
    <div className="d-flex align-items-center justify-content-center my-3 py-4">
      <Glass>
        <form onSubmit={handleOnSubmit}>
          <h3 className="fw-bolder mb-4 text-center">Create Account</h3>

          <div className="mb-2 fw-bold">
            <label htmlFor="inputState" className="form-label">
              Country
            </label>
            <select
              id="inputState"
              className="form-select"
              value={userInputs.country}
              onChange={(e) =>
                setUserInput({ ...userInputs, country: e.target.value })
              }
            >
              <option value="">Choose...</option>
              {ALL_COUNTRIES.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2 fw-bold">
            <label htmlFor="inputEmail" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="inputEmail"
              onChange={(e) =>
                setUserInput({ ...userInputs, email: e.target.value })
              }
              value={userInputs.email}
            />
          </div>

          <div className="mb-2 fw-bold">
            <label htmlFor="input-first-name" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="input-first-name"
              onChange={(e) =>
                setUserInput({ ...userInputs, first_name: e.target.value })
              }
              value={userInputs.first_name}
            />
          </div>

          <div className="mb-2 fw-bold">
            <label htmlFor="input-last-name" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="input-last-name"
              onChange={(e) =>
                setUserInput({ ...userInputs, last_name: e.target.value })
              }
              value={userInputs.last_name}
            />
          </div>

          <div className="mb-2 fw-bold">
            <label htmlFor="input-username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="input-username"
              onChange={(e) =>
                setUserInput({ ...userInputs, username: e.target.value })
              }
              value={userInputs.username}
            />
          </div>

          <div className="mb-4 fw-bold">
            <label htmlFor="input-password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="input-password"
              onChange={(e) =>
                setUserInput({ ...userInputs, password: e.target.value })
              }
              value={userInputs.password}
            />
          </div>

          {error ? (
            <>
              <p className="text-center text-danger fw-bold">
                Something wrong happened! Try again...
              </p>
            </>
          ) : (
            <></>
          )}

          <p className="text-center fw-bold">
            Already have an account?{" "}
            <Link className="text-decoration-none fw-bold" to="/login">
              Login
            </Link>
          </p>

          <div className="mb-3">
            <button type="submit" className="btn btn-primary col-12 fw-bolder">
              Continue
            </button>
          </div>
        </form>
      </Glass>
    </div>
  );
}

export default SignUp;
