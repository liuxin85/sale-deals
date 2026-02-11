import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Signin.css";
import { useActionState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { session, signInUser } = useAuth();
  const navigate = useNavigate();

  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      // 1. Extract form data
      const email = formData.get("email");
      const password = formData.get("password");

      try {
        // 2. Call our sign-in function
        const {
          success,
          data,
          error: signInError,
        } = await signInUser(email, password);

        // 3. Handle known errors
        if (signInError) {
          return new Error(signInError);
        }

        // 4. handle sucess (e.g. redirect, return null)
        if (success && data?.session) {
          navigate("/dashboard");
          return null;
        }

        // 5. Handle any other cases
        return null;
      } catch (error) {
        // 6. Handle unexprect error (return error)
        console.error("Sign in error: ", error.message);
        return new Error("An unexprected error occurred. Please try again.");
      }
    },
    null,
  );

  return (
    <div>
      <h1 className="landing-header">Paper Like A Boss</h1>
      <div className="sign-form-container">
        <form
          action={submitAction}
          aria-label="Sign in form"
          aria-description="form-description"
        >
          <div id="form-description" className="sr-only">
            Use this form to sign in to your account. Enter you email and
            password
          </div>

          <h2 className="form-title">Sign Up Today</h2>
          <p>
            Already have an account? Sign in
            <Link to="/">Sign in</Link>
          </p>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-input"
            name="email"
            id="email"
            placeholder=""
            required
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "signin-error" : undefined}
            disabled={isPending}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-input"
            name="password"
            id="password"
            placeholder=""
            required
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "signin-error" : undefined}
            disabled={isPending}
          />

          <button
            type="submit"
            className="form-button"
            aria-busy={isPending}
            disabled={isPending}
          >
            {isPending ? "Signing Up" : "Sign Up"}
          </button>

          {/* Error message */}
          {error && (
            <div
              id="signin-error"
              role="alert"
              className="sign-form-error-message"
            >
              {error.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
