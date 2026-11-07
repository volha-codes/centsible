import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

import { useAppDispatch } from "../../app/hooks";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import Input from "../../components/ui/Input";
import type { ApiErrorPayload } from "../../lib/api";
import { toastShown } from "../ui/uiSlice";
import { getRegisterErrorMessage } from "./authErrors";
import AuthLayout from "./AuthLayout";
import { register } from "./authSlice";

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setEmailError(null);
    setIsSubmitting(true);
    try {
      await dispatch(register({ firstName, email, password })).unwrap();
      dispatch(toastShown("You successfully created an account.", "success"));
      navigate("/accounts", { replace: true });
    } catch (error) {
      const errorData = getRegisterErrorMessage(error as ApiErrorPayload);
      if (errorData.field === "email") {
        setEmailError(errorData.message);
      } else {
        setError(errorData.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <Field label="First name">
          <Input
            required
            type="text"
            autoComplete="given-name"
            placeholder="e.g. Anna"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Field>
        <Field label="Email" error={emailError}>
          <Input
            required
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(null);
            }}
          />
        </Field>
        <Field label="Password">
          <Input
            required
            type="password"
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        {error && (
          <p role="alert" className="text-sm text-expense">
            {error}
          </p>
        )}

        <Button type="submit" loading={isSubmitting} className="w-full">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register;
