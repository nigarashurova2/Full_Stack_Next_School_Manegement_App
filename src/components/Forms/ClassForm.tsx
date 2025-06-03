"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import SelectField from "../SelectField";
import FileInputField from "../FileInputField";
import { ClassSchema, classSchema } from "@/lib/formValidationSchemas";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { createClass, updateClass } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";

const ClassForm = ({
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
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
  });

  const router = useRouter();
  const [state, formAction] = useFormState(
    type === "create" ? createClass : updateClass,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Subject has been ${type === "create" ? "created" : "updated"}`,
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

  const onSubmit = handleSubmit((data: ClassSchema) => {
    console.log(data);
    formAction(data);
  });

    const { teachers, grades } = relatedData;

  const gradeOptions = grades.map(
    (grade: { id: number; level: number }) => ({
      val: grade.id,
      label: grade.level,
    })
  );

  const supervisorOptions = teachers.map(
    (item: { id: number; name: string; surname: string }) => ({
      label: item.name + " " + item.surname,
      val: item.id,
    })
  );

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1>{type === "create" ? "Create a new class" : "Update a class"}</h1>

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
          label="Capacity"
          type="number"
          register={register}
          name="capacity"
          defaultValue={data?.capacity}
          error={errors.capacity}
        />
        <SelectField
          label="Supervisor"
          register={register}
          name="supervisorId"
          defaultValue={data?.supervisorId}
          options={supervisorOptions}
          error={errors.supervisorId}
          multiple={false}
        />
        <SelectField
          label="Grade"
          register={register}
          name="gradeId"
          defaultValue={data?.gradeId}
          options={gradeOptions}
          error={errors.gradeId}
          multiple={false}
        />
        {data && (
          <InputField
            label="id"
            type="number"
            register={register}
            name="id"
            defaultValue={data?.id}
            error={errors.id}
            hidden={true}
          />
        )}
      </div>
      {state.error && <span className="text-red-500">{state.message}</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md " type="submit">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ClassForm;
