import { useActionState } from "react";
import "./Form.css"; // 引入下方定义的 CSS 文件
import supabase from "../supabase-client";
import { useAuth } from "../AuthContext";

function Form({ metrics }) {
  const { users } = useAuth();
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const submitedName = formData.get("name")

      // Find the user object from 'users' array
     const user =  users.find(u => u.name === submitedName)
      // Action logic
      const newDeal = {
        user_id: user.id,
        value: formData.get("value"),
      };
      console.log(newDeal);
      // Async operation
      const { error } = await supabase.from("sales_deals").insert(newDeal);

      if (error) {
        console.log("Error adding deal: ", error.message);
        return new Error("Failed to add deal");
      }

      // Return error state
      return null;
    },
    null,
  );

  const generateOptions = () => {
    return users?.map((user) => (
      <option key={user.id} value={user.name}>
        {user.name}
      </option>
    ));
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <header className="form-header">
          <h2>Add New Deal</h2>
          <p id="form-description">
            Fill in the details below to track a new sales opportunity.
          </p>
        </header>

        <form
          action={submitAction}
          aria-label="Add new sales deal"
          className="deal-form"
        >
          <div className="form-group">
            <label htmlFor="deal-name">Sales Representative</label>
            <select
              id="deal-name"
              name="name"
              defaultValue={metrics?.[0]?.name || ""}
              aria-required="true"
              aria-invalid={!!error}
              disabled={isPending}
              className="form-input"
            >
              {generateOptions()}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="deal-value">Deal Amount ($)</label>
            <input
              id="deal-value"
              type="number"
              name="value"
              defaultValue={0}
              min="0"
              step={10}
              aria-required="true"
              disabled={isPending}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            className={`submit-btn ${isPending ? "loading" : ""}`}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? (
              <span className="spinner-text">Processing...</span>
            ) : (
              "Add Deal"
            )}
          </button>
        </form>

        {error && (
          <div role="alert" className="error-message">
            <span className="error-icon">⚠️</span> {error.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Form;
