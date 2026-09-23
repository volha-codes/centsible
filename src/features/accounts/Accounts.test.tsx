import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import uiReducer from "../ui/uiSlice";
import Accounts from "./Accounts";
import accountsReducer from "./accountsSlice";

function renderWithStore() {
  const store = configureStore({
    reducer: { accounts: accountsReducer, ui: uiReducer },
  });

  return render(
    <Provider store={store}>
      <Accounts />
    </Provider>,
  );
}

describe("accounts actions", () => {
  it("renders the account form", () => {
    renderWithStore();

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Currency")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Account" }),
    ).toBeInTheDocument();
  });

  it("adds a new account to the list", async () => {
    const user = userEvent.setup();
    renderWithStore();

    await user.type(screen.getByLabelText("Name"), "Main Account");
    await user.type(screen.getByLabelText("Starting Balance"), "500");
    await user.click(screen.getByRole("button", { name: "Add Account" }));

    expect(screen.getByText("Main Account")).toBeInTheDocument();
  });
});
