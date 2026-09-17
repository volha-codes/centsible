import { findDuplicateAccountName } from "./accountsSlice";

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
