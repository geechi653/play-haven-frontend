// any helper functions go here

export function validateUsername(username) {
  if (!username || username.trim() === "") {
    return "Username cannot be empty.";
  }
  if (username.trim().split(/\s+/).length > 1) {
    return "Username cannot contain spaces.";
  }
  return null;
}

export function validatePassword(password) {
  if (!password || password.trim() === "") {
    return "Password cannot be empty.";
  }
  return null;
}


export function validateEmail(email) {
  if (!email || email.trim() === "") {
    return "Email cannot be empty.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email address.";
  }
  return null;
}


export function validateRequiredField(value, fieldName) {
  if (!value || value.trim() === "") {
    return `${fieldName} is required.`;
  }
  return null;
}


export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword || confirmPassword.trim() === "") {
    return "Confirm password is required.";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }
  return null;
}
