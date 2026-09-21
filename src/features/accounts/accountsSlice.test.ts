import accountsReducer, {
  accountAdded,
  accountRemoved,
  accountUpdated,
  findDuplicateAccountName,
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
  it("adds an account", () => {
    const initialState = accountsReducer(undefined, { type: "unknown" });

    const nextState = accountsReducer(
      initialState,
      accountAdded({
        name: "Main Account",
        currency: "PLN",
        startingBalance: 0,
      }),
    );

    expect(nextState.ids).toHaveLength(1);

    const addedId = nextState.ids[0];
    expect(nextState.entities[addedId]).toMatchObject({
      name: "Main Account",
      currency: "PLN",
      startingBalance: 0,
    });
  });

  it("updates an existing account", () => {
    const initialState = accountsReducer(undefined, { type: "unknown" });
    const withAccount = accountsReducer(
      initialState,
      accountAdded({
        name: "Main Account",
        currency: "PLN",
        startingBalance: 0,
      }),
    );
    const id = withAccount.ids[0];

    const nextState = accountsReducer(
      withAccount,
      accountUpdated({ id, changes: { name: "Renamed" } }),
    );

    expect(nextState.entities[id]?.name).toBe("Renamed");
  });

  it("removes an account", () => {
    const initialState = accountsReducer(undefined, { type: "unknown" });
    const withAccount = accountsReducer(
      initialState,
      accountAdded({
        name: "Main Account",
        currency: "PLN",
        startingBalance: 0,
      }),
    );
    const id = withAccount.ids[0];

    const nextState = accountsReducer(withAccount, accountRemoved(id));

    expect(nextState.ids).toHaveLength(0);
  });
});
