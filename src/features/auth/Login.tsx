import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

import { useAppDispatch } from "../../app/hooks";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import Input from "../../components/ui/Input";
import type { ApiErrorPayload } from "../../lib/api";
import { toastShown } from "../ui/uiSlice";
import {
  getLoginErrorMessage,
  validateEmail,
  validatePasswordRequired,
} from "./authErrors";
import AuthLayout from "./AuthLayout";
import { login, loginDemo } from "./authSlice";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailError = validateEmail(email);
  const passwordError = validatePasswordRequired(password);

  const markTouched = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleDemo = async () => {
    if (isSubmitting || isDemoLoading) return;

    setError(null);
    setIsDemoLoading(true);
    try {
      await dispatch(loginDemo()).unwrap();
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(getLoginErrorMessage(error as ApiErrorPayload));
      setIsDemoLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || isDemoLoading) return;

    setError(null);

    if (emailError || passwordError) {
      setTouched({ email: true, password: true });
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(login({ email, password })).unwrap();
      dispatch(toastShown("You successfully signed in.", "success"));
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(getLoginErrorMessage(error as ApiErrorPayload));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      footer={
        <>
          New to Centsible?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col gap-3.5"
      >
        <Field label="Email" error={touched.email ? emailError : null}>
          <Input
            required
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            onBlur={() => markTouched("email")}
          />
        </Field>
        <Field label="Password" error={touched.password ? passwordError : null}>
          <Input
            required
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
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

        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isDemoLoading}
          className="w-full"
        >
          Sign in
        </Button>
      </form>

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <p className="text-sm text-muted">
          Just looking around? Explore the app with sample accounts, categories
          and transactions. No sign-up needed.
        </p>
        <Button
          type="button"
          variant="secondary"
          loading={isDemoLoading}
          disabled={isSubmitting}
          onClick={handleDemo}
          className="w-full"
        >
          Try the demo
        </Button>
      </div>
    </AuthLayout>
  );
};

export default Login;
