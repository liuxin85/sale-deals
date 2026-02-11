import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Signin.css";
import { useActionState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { signUpNewUser } = useAuth();
  const navigate = useNavigate();

  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const email = formData.get("email");
      const password = formData.get("password");
      const name = formData.get("name");
      const accountType = formData.get("account-type");

      try {
        const {
          success,
          data,
          error: signUpError,
        } = await signUpNewUser(email, password, name, accountType);

        if (signUpError) {
          return new Error(signUpError);
        }

        if (success && data?.session) {
          navigate("/dashboard");
          return null;
        }
        return null;
      } catch (error) {
        console.error("Sign up error: ", error.message);
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
            Already have an account?
            <Link to="/">Sign in</Link>
          </p>

          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-input"
            name="name"
            id="name"
            placeholder=""
            required
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "signup-error" : undefined}
            disabled={isPending}
          />

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
            aria-describedby={error ? "signup-error" : undefined}
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
            aria-describedby={error ? "signup-error" : undefined}
            disabled={isPending}
          />
          <fieldset
            className="form-fieldset"
            aria-required="true"
            aria-label="Select your fole"
          >
            <legend>Select your role</legend>
            <div className="radio-groupd">
              <label>
                <input
                  type="radio"
                  name="account-type"
                  value="admin"
                  required
                />
                Admin
              </label>
              <label>
                <input type="radio" name="account-type" value="rep" required />
                Sales Rep
              </label>
            </div>
          </fieldset>

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
