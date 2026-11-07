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
