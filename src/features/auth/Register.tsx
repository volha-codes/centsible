import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

import { useAppDispatch } from "../../app/hooks";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import Input from "../../components/ui/Input";
import type { ApiErrorPayload } from "../../lib/api";
import { toastShown } from "../ui/uiSlice";
import {
  getRegisterErrorMessage,
  validateEmail,
  validateFirstName,
  validatePassword,
} from "./authErrors";
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
  const [touched, setTouched] = useState({
    firstName: false,
    email: false,
    password: false,
  });

  const firstNameError = validateFirstName(firstName);
  const emailValidationError = validateEmail(email);
  const passwordError = validatePassword(password);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);

    if (firstNameError || emailValidationError || passwordError) {
      setTouched({ firstName: true, email: true, password: true });
      return;
    }

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

  const markTouched = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
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
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col gap-3.5"
      >
        <Field
          label="First name"
          error={touched.firstName ? firstNameError : null}
        >
          <Input
            required
            type="text"
            autoComplete="given-name"
            placeholder="e.g. Anna"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setError(null);
            }}
            onBlur={() => markTouched("firstName")}
          />
        </Field>
        <Field
          label="Email"
          error={emailError ?? (touched.email ? emailValidationError : null)}
        >
          <Input
            required
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(null);
              setError(null);
            }}
            onBlur={() => markTouched("email")}
          />
        </Field>
        <Field
          label="Password"
          error={touched.password ? passwordError : null}
          hint="At least 8 characters"
        >
          <Input
            required
            type="password"
            minLength={8}
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            onBlur={() => markTouched("password")}
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
