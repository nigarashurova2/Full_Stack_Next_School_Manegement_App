"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import SelectField from "../SelectField";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  AssignmentSchema,
  assignmentSchema,
} from "@/lib/formValidationSchemas";
import { Bounce, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { createAssignment, updateAssignment } from "@/lib/actions";
import { formatDateTimeLocal } from "./ExamForm";

const AssignmentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentSchema>({
    resolver: zodResolver(assignmentSchema),
  });

  const router = useRouter();
  const [state, formAction] = useFormState(
    type === "create" ? createAssignment : updateAssignment,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Assignment has been ${type === "create" ? "created" : "updated"}`,
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

  const onSubmit = handleSubmit((data: AssignmentSchema) => {
    formAction(data);
  });

  const { lessons } = relatedData;
  const lessonOptions = lessons.map((item: { id: number; name: string }) => ({
    label: item.name,
    val: item.id,
  }));

  return (
    <form action="" className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1>
        {type === "create" ? "Create a new assignment" : "Update a assignment"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Assignment title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Start Date"
          name="startDate"
          defaultValue={
            data?.startDate ? formatDateTimeLocal(data.startDate) : ""
          }
          register={register}
          error={errors?.startDate}
          type="datetime-local"
        />

        <InputField
          label="Due Date"
          name="dueDate"
          defaultValue={data?.dueDate ? formatDateTimeLocal(data.dueDate) : ""}
          register={register}
          error={errors?.dueDate}
          type="datetime-local"
        />

        <SelectField
          label="Lesson"
          register={register}
          name="lessonId"
          defaultValue={data?.lessonId}
          options={lessonOptions}
          multiple={false}
          error={errors?.lessonId}
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
      </div>
      {state.error && <span className="text-red-500">{state.message}</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md " type="submit">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default AssignmentForm;
