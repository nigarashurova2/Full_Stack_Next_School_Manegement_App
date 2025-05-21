"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import SelectField from "../SelectField";
import FileInputField from "../FileInputField";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  firstname: z.string().min(1, { message: "Firsname is required" }),
  lastname: z.string().min(1, { message: "Lastname is required" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  bloodType: z.string().min(1, { message: "Blood Type is required" }),
  birthday: z.date({ message: "Birthday is required" }),
  gender: z.enum(["male", "female"], { message: "Gender is required" }),
  img: z.instanceof(File, { message: "Image is required" }),
});

const genderOptions = [
  { label: "Male", val: "male" },
  { label: "Female", val: "female" },
];

// Schemadan cixarilan tip
type FormData = z.infer<typeof schema>;

const ResultForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data: FormData) => {
    console.log(data);
  });

  return (
    <form action="" className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1>{type === "create" ? 'Create a new result' : 'Update a result'}</h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <InputField
          label="Username"
          type="text"
          register={register}
          name="username"
          defaultValue={data?.username}
          error={errors.username}
        />
        <InputField
          label="Email"
          type="email"
          register={register}
          name="email"
          defaultValue={data?.email}
          error={errors.email}
        />
        <InputField
          label="Password"
          type="password"
          register={register}
          name="password"
          defaultValue={data?.password}
          error={errors.password}
        />
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <InputField
          label="Firstname"
          type="text"
          register={register}
          name="firstname"
          defaultValue={data?.firstname}
          error={errors.firstname}
        />
        <InputField
          label="Lastname"
          type="text"
          register={register}
          name="lastname"
          defaultValue={data?.lastname}
          error={errors.lastname}
        />
        <InputField
          label="Phone"
          type="text"
          register={register}
          name="phone"
          defaultValue={data?.phone}
          error={errors.phone}
        />
        <InputField
          label="Address"
          type="text"
          register={register}
          name="address"
          defaultValue={data?.address}
          error={errors.address}
        />
        <InputField
          label="Blood Type"
          type="text"
          register={register}
          name="bloodType"
          defaultValue={data?.bloodType}
          error={errors.bloodType}
        />
        <InputField
          label="Birthday"
          type="date"
          register={register}
          name="birthday"
          defaultValue={data?.birthday}
          error={errors.birthday}
        />
        <SelectField
          label="Gender"
          register={register}
          name="gender"
          defaultValue={data?.gender}
          error={errors.gender}
          options={genderOptions}
        />
        <FileInputField
          label="Image"
          register={register}
          name="img"
          defaultValue={data?.img}
          error={errors.img}
        />
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md " type="submit">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ResultForm;
