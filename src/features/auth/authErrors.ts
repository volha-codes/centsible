import type { ApiErrorPayload } from "../../lib/api";

const NETWORK_ERROR_MESSAGE =
  "Can't reach the server. Check your connection and try again.";
const SERVER_ERROR_MESSAGE =
  "Something went wrong on our side. Please try again in a moment.";

export function getLoginErrorMessage(error: ApiErrorPayload): string {
  if (error.status === 401) {
    return "Invalid email or password.";
  } else if (error.status === 0) {
    return NETWORK_ERROR_MESSAGE;
  } else if (error.status >= 500) {
    return SERVER_ERROR_MESSAGE;
  }

  return "Couldn't sign in. Please try again.";
}

export function getRegisterErrorMessage(error: ApiErrorPayload): {
  field: "email" | null;
  message: string;
} {
  if (error.status === 409) {
    return {
      field: "email",
      message: "An account with this email already exists.",
    };
  } else if (error.status === 400) {
    return {
      field: null,
      message: "Please check the entered details and try again.",
    };
  } else if (error.status === 0) {
    return {
      field: null,
      message: NETWORK_ERROR_MESSAGE,
    };
  } else if (error.status >= 500) {
    return {
      field: null,
      message: SERVER_ERROR_MESSAGE,
    };
  }

  return {
    field: null,
    message: "Couldn't create the account. Please try again.",
  };
}

export function validateFirstName(value: string): string | null {
  const name = value.trim();

  if (!name) {
    return "Enter your first name.";
  } else if (name.length > 50) {
    return "Use 50 characters or fewer.";
  }

  return null;
}

export function validateEmail(value: string): string | null {
  const email = value.trim();

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return "Enter a valid email address.";
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Use at least 8 characters.";
  }

  return null;
}
