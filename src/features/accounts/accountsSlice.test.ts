import accountsReducer, {
  createAccount,
  deleteAccount,
  fetchAccounts,
  findDuplicateAccountName,
  updateAccount,
} from "./accountsSlice";

describe("findDuplicateAccountName", () => {
  it("returns true for an exact name match", () => {
    const accounts = [
      {
        id: "1",
        name: "Main Account",
        currency: "PLN",
        startingBalance: 0,
      },
    ];

    expect(findDuplicateAccountName(accounts, "Main Account")).toBe(true);
  });

  it("returns true for a case-insensitive match", () => {
    const accounts = [
      {
        id: "1",
        name: "Main Account",
        currency: "PLN",
        startingBalance: 0,
      },
    ];

    expect(findDuplicateAccountName(accounts, "main account")).toBe(true);
  });

  it("returns true when the name matches after trimming surrounding spaces", () => {
    const accounts = [
      {
        id: "1",
        name: "Main Account",
        currency: "PLN",
        startingBalance: 0,
      },
    ];

    expect(findDuplicateAccountName(accounts, " Main Account ")).toBe(true);
  });

  it("returns false when there are no matches", () => {
    const accounts = [
      {
        id: "1",
        name: "Main Account",
        currency: "PLN",
        startingBalance: 0,
      },
    ];

    expect(findDuplicateAccountName(accounts, "Savings")).toBe(false);
  });

  it("returns false when the only match is the account excluded by id", () => {
    const accounts = [
      {
        id: "1",
        name: "Main Account",
        currency: "PLN",
        startingBalance: 0,
      },
    ];

    expect(findDuplicateAccountName(accounts, "Main Account", "1")).toBe(false);
  });

  it("returns false for an empty accounts array", () => {
    expect(findDuplicateAccountName([], "Main Account")).toBe(false);
  });
});

describe("accountsSlice reducer", () => {
  it("sets status to loading while accounts are being fetched", () => {
    const initialState = accountsReducer(undefined, { type: "unknown" });

    const nextState = accountsReducer(
      initialState,
      fetchAccounts.pending("", undefined),
    );

    expect(nextState.status).toBe("loading");
  });

  it("clears the previous error when a new fetch starts", () => {
    const failedState = accountsReducer(
      undefined,
      fetchAccounts.rejected(
        new Error("Failed to fetch accounts"),
        "",
        undefined,
      ),
    );

    expect(failedState.error).not.toBeNull();

    const nextState = accountsReducer(
      failedState,
      fetchAccounts.pending("", undefined),
    );

    expect(nextState.error).toBeNull();
  });

  it("sets status to succeeded and populates accounts when fetch is successful", () => {
    const initialState = accountsReducer(undefined, { type: "unknown" });

    const accounts = [
      {
        id: "1",
        name: "Main Account",
        currency: "PLN",
        startingBalance: 0,
      },
    ];

    const nextState = accountsReducer(
      initialState,
      fetchAccounts.fulfilled(accounts, "", undefined),
    );

    expect(nextState.status).toBe("succeeded");
    expect(nextState.ids).toHaveLength(1);
    expect(nextState.entities["1"]).toEqual(accounts[0]);
  });

  it("sets status to failed and populates error when fetch fails", () => {
    const initialState = accountsReducer(undefined, { type: "unknown" });

    const nextState = accountsReducer(
      initialState,
      fetchAccounts.rejected(
        new Error("Failed to fetch accounts"),
        "",
        undefined,
      ),
    );

    expect(nextState.status).toBe("failed");
    expect(nextState.error).toBe(
      "Couldn't load accounts. Check your connection and try again.",
    );
  });

  it("creates a new account when createAccount is fulfilled", () => {
    const initialState = accountsReducer(undefined, { type: "unknown" });

    const newAccount = {
      id: "1",
      name: "Main Account",
      currency: "PLN",
      startingBalance: 0,
    };

    const nextState = accountsReducer(
      initialState,
      createAccount.fulfilled(newAccount, "", {
        name: "Main Account",
        currency: "PLN",
        startingBalance: 0,
      }),
    );

    expect(nextState.ids).toHaveLength(1);
    expect(nextState.entities["1"]).toEqual(newAccount);
  });

  it("updates an existing account when updateAccount is fulfilled", () => {
    const initialState = accountsReducer(undefined, { type: "unknown" });

    const existingAccount = {
      id: "1",
      name: "Main Account",
      currency: "PLN",
      startingBalance: 0,
    };

    const stateWithAccount = accountsReducer(
      initialState,
      createAccount.fulfilled(existingAccount, "", {
        name: "Main Account",
        currency: "PLN",
        startingBalance: 0,
      }),
    );

    const updatedAccount = {
      id: "1",
      name: "Updated Account",
      currency: "USD",
      startingBalance: 100,
    };

    const nextState = accountsReducer(
      stateWithAccount,
      updateAccount.fulfilled(updatedAccount, "", {
        id: "1",
        changes: {
          name: "Updated Account",
          currency: "USD",
          startingBalance: 100,
        },
      }),
    );

    expect(nextState.ids).toHaveLength(1);
    expect(nextState.entities["1"]).toEqual(updatedAccount);
  });

  it("deletes an existing account when deleteAccount is fulfilled", () => {
    const initialState = accountsReducer(undefined, { type: "unknown" });

    const existingAccount = {
      id: "1",
      name: "Main Account",
      currency: "PLN",
      startingBalance: 0,
    };

    const stateWithAccount = accountsReducer(
      initialState,
      createAccount.fulfilled(existingAccount, "", {
        name: "Main Account",
        currency: "PLN",
        startingBalance: 0,
      }),
    );

    const nextState = accountsReducer(
      stateWithAccount,
      deleteAccount.fulfilled("1", "", "1"),
    );

    expect(nextState.ids).toHaveLength(0);
    expect(nextState.entities["1"]).toBeUndefined();
  });

  it("keeps existing accounts when createAccount is fulfilled", () => {
    const initialState = accountsReducer(undefined, { type: "unknown" });

    const existingAccount = {
      id: "1",
      name: "Main Account",
      currency: "PLN",
      startingBalance: 0,
    };

    const stateWithAccount = accountsReducer(
      initialState,
      fetchAccounts.fulfilled([existingAccount], "", undefined),
    );

    expect(stateWithAccount.ids).toHaveLength(1);
    expect(stateWithAccount.entities["1"]).toEqual(existingAccount);

    const newAccount = {
      id: "2",
      name: "Savings Account",
      currency: "USD",
      startingBalance: 100,
    };

    const nextState = accountsReducer(
      stateWithAccount,
      createAccount.fulfilled(newAccount, "", {
        name: "Savings Account",
        currency: "USD",
        startingBalance: 100,
      }),
    );

    expect(nextState.ids).toHaveLength(2);
    expect(nextState.entities["1"]).toEqual(existingAccount);
    expect(nextState.entities["2"]).toEqual(newAccount);
  });
});
