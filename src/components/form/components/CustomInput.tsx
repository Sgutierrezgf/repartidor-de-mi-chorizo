import "./CustomInput.css";
import { type FieldError, type Control, Controller, type FieldValues, type Path, type PathValue } from "react-hook-form";

interface Props<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: string;
  control: Control<T>;
  error?: FieldError;
}

const CustomInput = <T extends FieldValues>({
  name,
  label,
  type,
  control,
  error,
}: Props<T>) => {
  return (
    <div className="form-group" >
      <label htmlFor={name}>{label}</label>

      <Controller
        name={name}
        control={control}
        defaultValue={"" as PathValue<T, Path<T>>}
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