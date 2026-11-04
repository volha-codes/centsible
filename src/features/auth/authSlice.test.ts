import authReducer, { fetchMe, login, logout, register } from "./authSlice";

const user = {
  id: "1",
  email: "olya@example.com",
  firstName: "Olya",
};

describe("authSlice reducer", () => {
  it("starts with an unknown session and no user", () => {
    const initialState = authReducer(undefined, { type: "unknown" });

    expect(initialState.status).toBe("unknown");
    expect(initialState.user).toBeNull();
  });

  it("stores the user when the session check succeeds", () => {
    const user = { id: "1", email: "olya@example.com", firstName: "Olya" };
    const initialState = authReducer(undefined, { type: "unknown" });

    const nextState = authReducer(
      initialState,
      fetchMe.fulfilled(user, "", undefined),
    );

    expect(nextState.status).toBe("authenticated");
    expect(nextState.user).toEqual(user);
  });

  it("clears the user and marks the session as anonymous when the session check fails", () => {
    const initialState = authReducer(undefined, { type: "unknown" });

    const nextState = authReducer(
      initialState,
      fetchMe.fulfilled(user, "", undefined),
    );

    expect(nextState.status).toBe("authenticated");
    expect(nextState.user).toEqual(user);

    const finalState = authReducer(
      nextState,
      fetchMe.rejected(null, "", undefined),
    );

    expect(finalState.status).toBe("anonymous");
    expect(finalState.user).toBeNull();
  });

  it.each([
    {
      name: "login",
      action: login.fulfilled(user, "", {
        email: "olya@example.com",
        password: "12345678",
      }),
    },
    {
      name: "register",
      action: register.fulfilled(user, "", {
        email: "olya@example.com",
        password: "12345678",
        firstName: "Olya",
      }),
    },
  ])(
    "stores the user and authenticates the session after $name succeeds",
    ({ action }) => {
      const initialState = authReducer(undefined, { type: "unknown" });
      const nextState = authReducer(initialState, action);

      expect(nextState.user).toEqual(user);
      expect(nextState.status).toBe("authenticated");
    },
  );

  it("clears the user and signs the session out when logout succeeds", () => {
    const initialState = authReducer(undefined, { type: "unknown" });

    const nextState = authReducer(
      initialState,
      fetchMe.fulfilled(user, "", undefined),
    );

    expect(nextState.status).toBe("authenticated");
    expect(nextState.user).toEqual(user);

    const finalState = authReducer(
      nextState,
      logout.fulfilled(undefined, "", undefined),
    );

    expect(finalState.status).toBe("anonymous");
    expect(finalState.user).toBeNull();
  });

  it("keeps the session unchanged when sign-in fails", () => {
    const initialState = authReducer(undefined, { type: "unknown" });

    const previous = authReducer(
      initialState,
      fetchMe.rejected(null, "", undefined),
    );
    expect(previous.status).toBe("anonymous");
    expect(previous.user).toBeNull();

    const nextState = authReducer(
      previous,
      login.rejected(null, "", {
        email: "olya@example.com",
        password: "wrongpassword",
      }),
    );
    expect(nextState).toBe(previous);
  });
});
