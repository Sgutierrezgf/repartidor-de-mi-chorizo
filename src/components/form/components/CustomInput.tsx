import { type FieldError, type Control, Controller } from "react-hook-form";
import "./CustomInput.css";
import type { FormValues } from "../models";

interface Props {
  name: keyof FormValues;
  label: string;
  type: string;
  control: Control<FormValues>;
  error?: FieldError;
}

const CustomInput = ({ name, label, type, control, error }: Props) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <input
            id={name}
            type={type}
            {...field}
            className={`form-control ${error ? "is-invalid" : ""}`}
          />
        )}
      />
      {error && <div className="error">{error.message}</div>}
    </div>
  );
};

export default CustomInput;
