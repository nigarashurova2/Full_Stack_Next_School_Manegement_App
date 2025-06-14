import { FieldError } from "react-hook-form";

interface InputFieldProps {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  hidden?: boolean;
}

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
  hidden,
}: InputFieldProps) => {
  return (
    <div
      className={`flex ${
        type === "checkbox" ? "flex-row items-center" : "flex-col"
      } gap-2 w-full md:w-1/4 ${hidden && "hidden"}`}
    >
      <label htmlFor={name} className="text-xs text-gray-500">
        {label}
      </label>
      <input
        type={type}
        // checked={defaultValue}
        defaultValue={defaultValue}
        {...register(name)}
        className={`${
          type !== "checkbox"
            ? "ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            : ""
        }`}
        {...inputProps}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
