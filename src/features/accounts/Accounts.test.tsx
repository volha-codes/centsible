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
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      }),
    );
  });

  it("renders the account form", () => {
    renderWithStore();

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Currency")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Account" }),
    ).toBeInTheDocument();
  });

  it("shows the empty state when the server returns no accounts", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      }),
    );

    renderWithStore();

    expect(await screen.findByText("No accounts yet.")).toBeInTheDocument();
  });

  it("shows an error and loads the accounts after clicking Retry", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "1",
            name: "Main Account",
            currency: "PLN",
            startingBalance: 3200,
          },
        ],
      });

    vi.stubGlobal("fetch", fetchMock);

    renderWithStore();

    await screen.findByText(
      "Couldn't load accounts. Check your connection and try again.",
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Retry" }));

    await screen.findByText("Main Account");

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("adds a new account when the form is submitted", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "1",
          name: "Main Account",
          currency: "PLN",
          startingBalance: 3200,
        }),
      });

    vi.stubGlobal("fetch", fetchMock);

    renderWithStore();

    await screen.findByText("No accounts yet.");

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Name"), "Main Account");
    await user.type(screen.getByLabelText("Starting Balance"), "3200");
    await user.click(screen.getByRole("button", { name: "Add Account" }));

    await screen.findByText("Main Account");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/accounts"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "Main Account",
          currency: "PLN",
          startingBalance: 3200,
        }),
      }),
    );
  });

  it("sends a single request on double click", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce(new Promise(() => {}));

    vi.stubGlobal("fetch", fetchMock);

    renderWithStore();

    await screen.findByText("No accounts yet.");

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Name"), "Main Account");
    await user.type(screen.getByLabelText("Starting Balance"), "3200");
    await user.dblClick(screen.getByRole("button", { name: "Add Account" }));

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
