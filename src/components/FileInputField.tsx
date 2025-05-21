import Image from "next/image";
import { FieldError } from "react-hook-form";

interface FileInputFieldProps {
  label: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const FileInputField = ({
  label,
  register,
  name,
  defaultValue,
  error,
  inputProps,
}: FileInputFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4">
      <label htmlFor={name} className="text-xs text-gray-500 cursor-pointer flex flex-col justify-center items-center  ring-[1.5px] ring-gray-300 p-2 rounded-md">
        <Image src="/upload.png" alt="" width={20} height={20}/>
        <span>Upload a photo</span>
      </label>
      <input
        type="file"
        id={name}
        {...register(name)}
        className="hidden"
        defaultValue={defaultValue}
        {...inputProps}
      />
      {error?.message && (
        <p className="text-xs text-red-400">
          {error.message.toString()}
        </p>
      )}
    </div>
  );
};

export default FileInputField;
