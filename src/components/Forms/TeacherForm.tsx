"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import SelectField from "../SelectField";
import FileInputField from "../FileInputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  genderOptions,
  teacherSchema,
  TeacherSchema,
} from "@/lib/formValidationSchemas";
import { createTeacher, updateTeacher } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";

const TeacherForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update";
  data?: any;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
  });

  const router = useRouter();
  const {subjects} = relatedData;
  const [state, formAction] = useFormState(
    type === "create" ? createTeacher : updateTeacher,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Teacher has been ${type === "create" ? "created" : "updated"}`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );
      setOpen(false);
      router.refresh();
    }
  }, [router, state]);

  const onSubmit = handleSubmit((data: TeacherSchema) => {
    console.log(data, "DATA");
    formAction(data);
  });
 
   const subjectOptions = subjects.map(
    (item: { id: number; name: string; }) => ({
      label: item.name,
      val: item.id,
    })
  );


  return (
    <form action="" className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1>{type === "create" ? "Create a new teacher" : "Update a teacher"}</h1>
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
          label="Name"
          type="text"
          register={register}
          name="name"
          defaultValue={data?.name}
          error={errors.name}
        />
        <InputField
          label="Surname"
          type="text"
          register={register}
          name="surname"
          defaultValue={data?.surname}
          error={errors.surname}
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
          defaultValue={data?.birthday.toISOString().split("T")[0]}
          error={errors.birthday}
        />
        <SelectField
          label="Gender"
          register={register}
          name="sex"
          defaultValue={data?.sex}
          error={errors.sex}
          options={genderOptions}
          multiple={false}
        />
        <SelectField
          label="Subjects"
          register={register}
          name="subjects"
          defaultValue={data?.subjects}
          error={errors?.subjects}
          options={subjectOptions}
          multiple={true}
        />
        {/* <FileInputField
          label="Image"
          register={register}
          name="img"
          defaultValue={""}
          error={errors.img}
        /> */}
      </div>
      {state.error && <span className="text-red-500">{state.message}</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md " type="submit">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default TeacherForm;
