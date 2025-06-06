"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import SelectField from "../SelectField";
import FileInputField from "../FileInputField";
import {
  genderOptions,
  StudentSchema,
  studentSchema,
} from "@/lib/formValidationSchemas";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { Bounce, toast } from "react-toastify";
import { createStudent, updateStudent } from "@/lib/actions";

const StudentForm = ({
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
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
  });

  const router = useRouter();
  const [state, formAction] = useFormState(
    type === "create" ? createStudent : updateStudent,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Student has been ${type === "create" ? "created" : "updated"}`,
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

  const onSubmit = handleSubmit((data: StudentSchema) => {
    console.log(data, "DATA");
    formAction(data);
  });

  const { grades, classes, parents } = relatedData;

  const gradeOptions = grades.map((item: { id: number; level: number }) => ({
    label: item.level,
    val: item.id,
  }));

  const parentOptions = parents.map((item: { id: number; name: string; surname:string }) => ({
    label: item.name + " " + item.surname,
    val: item.id,
  }));

  const classOptions = classes.map(
    (item: {
      id: number;
      name: string;
      capacity: number;
      _count: { students: number };
    }) => ({
      label: `${item.name} - ${item._count.students}/${item.capacity} Capacity`,
      val: item.id,
    })
  );

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new student" : "Update the student"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
        />
        <InputField
          label="Birthday"
          name="birthday"
          defaultValue={data?.birthday.toISOString().split("T")[0]}
          register={register}
          error={errors.birthday}
          type="date"
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <SelectField
          label="Parent Id"
          register={register}
          name="parentId"
          defaultValue={data?.parentId}
          error={errors.parentId}
          options={parentOptions}
          multiple={false}
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
          label="Grade"
          register={register}
          name="gradeId"
          defaultValue={data?.gradeId}
          error={errors.gradeId}
          options={gradeOptions}
          multiple={false}
        />
        <SelectField
          label="Class"
          register={register}
          name="classId"
          defaultValue={data?.classId}
          error={errors.classId}
          options={classOptions}
          multiple={false}
        />
      </div>
      {state.error && <span className="text-red-500">{state.message}</span>}
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default StudentForm;
