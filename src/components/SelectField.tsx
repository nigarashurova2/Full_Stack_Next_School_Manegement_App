import { FieldError } from "react-hook-form";

interface SelectFieldProps {
  label: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError | any;
  selectProps?: React.InputHTMLAttributes<HTMLInputElement>;
  options: {label:string, val:string}[];
  multiple: boolean
}

const SelectField = ({
  label,
  register,
  name,
  defaultValue,
  error,
  selectProps,
  options,
  multiple
}: SelectFieldProps) => {
  console.log(options, "options");
  
  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4" >
      <label htmlFor={name} className="text-xs text-gray-500">
        {label}
      </label>
      <select
        multiple={multiple}
        {...register(name)}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        defaultValue={defaultValue}
        {...selectProps}
      >
        {options.map((option, index)=> (
            <option key={option.val} value={option.val}>{option.label}</option>
        ))}
      </select>
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default SelectField;
