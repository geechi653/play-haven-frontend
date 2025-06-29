import { Link, useNavigate } from "react-router-dom";
import Glass from "../../components/glass/Glass";
import "./SignUp.css";
import { useEffect, useState } from "react";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import { ALL_COUNTRIES } from "../../constants/countries";
import { registerUser } from "../../utils/api";
import {
  validateUsername,
  validatePassword,
  validateEmail,
  validateRequiredField,
  validateConfirmPassword,
} from "../../utils/helpers";

function SignUp() {
  const { store, dispatch } = useGlobalStore();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [userInputs, setUserInput] = useState({
    country: "",
    email: "",
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (store.user.isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [store.user.isAuthenticated, navigate]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const requiredFields = [
      { value: userInputs.country, name: "Country" },
      { value: userInputs.email, name: "Email" },
      { value: userInputs.first_name, name: "First Name" },
      { value: userInputs.last_name, name: "Last Name" },
      { value: userInputs.username, name: "Username" },
      { value: userInputs.password, name: "Password" },
      { value: userInputs.confirmPassword, name: "Confirm Password" },
    ];
    for (const field of requiredFields) {
      const err = validateRequiredField(field.value, field.name);
      if (err) {
        setError(err);
        return;
      }
    }
    const emailError = validateEmail(userInputs.email);
    if (emailError) {
      setError(emailError);
      return;
    }
    const usernameError = validateUsername(userInputs.username);
    if (usernameError) {
      setError(usernameError);
      return;
    }
    const passwordError = validatePassword(userInputs.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    const confirmPasswordError = validateConfirmPassword(
      userInputs.password,
      userInputs.confirmPassword
    );
    if (confirmPasswordError) {
      setError(confirmPasswordError);
      return;
    }

    const user = {
      country: userInputs.country,
      email: userInputs.email,
      first_name: userInputs.first_name,
      last_name: userInputs.last_name,
      username: userInputs.username,
      password: userInputs.password,
    };

    try {
      const data = await registerUser(user);
      dispatch({
        type: "LOGIN",
        payload: { token: data.token, user: data.user },
      });
      setError("");
      navigate("/home");
    } catch (err) {
      setError(err.message || "Something wrong happened! Please try again...");
    }
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

          <div className="mb-2 fw-bold">
            <input
              type="password"
              className="form-control rounded-4 custom-input"
              id="input-confirm-password"
              placeholder="Confirm Password"
              onChange={(e) =>
                setUserInput({ ...userInputs, confirmPassword: e.target.value })
              }
              value={userInputs.confirmPassword}
            />
          </div>

          {error && (
            <p className="text-center text-danger fw-bold">{error}</p>
          )}

          <p className="text-center fw-bold custom-text">
            Already have an account?{" "}
            <Link className="fw-bolder text-link" to="/login">
              Login
            </Link>
          </p>

          <div className="mb-2">
            <button
              type="submit"
              className="custom-button fs-4 col-12 fw-bolder rounded-5"
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
