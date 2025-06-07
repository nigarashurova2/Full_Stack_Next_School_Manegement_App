"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import SelectField from "../SelectField";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  attendanceSchema,
  AttendanceSchema,
} from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createAttendance, updateAttendance } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";
import { formatDateTimeLocal } from "./ExamForm";

const AttendanceForm = ({
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
  } = useForm<AttendanceSchema>({
    resolver: zodResolver(attendanceSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createAttendance : updateAttendance,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Event has been ${type === "create" ? "created" : "updated"}`,
        {
          position: "top-right",
          autoClose: 1500,
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
  }, [state, router, type, setOpen]);

  const { lessons, students } = relatedData;
  const lessonOptions = lessons.map((item: { id: number; name: string }) => ({
    label: item.name,
    val: item.id,
  }));

  const studentOptions = students.map(
    (item: { id: number; name: string; surname: string }) => ({
      label: item.name + " " + item.surname,
      val: item.id,
    })
  );

  return (
    <form action="" className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1>
        {type === "create" ? "Create a new attendance" : "Update a attendance"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <SelectField
          label="Student Fullname"
          register={register}
          name="studentId"
          defaultValue={data?.studentId}
          options={studentOptions}
          multiple={false}
          error={errors?.studentId}
        />
        <SelectField
          label="Lesson Name"
          register={register}
          name="lessonId"
          defaultValue={data?.lessonId}
          options={lessonOptions}
          multiple={false}
          error={errors?.lessonId}
        />
        <InputField
          label="Date"
          name="date"
          defaultValue={data?.date ? formatDateTimeLocal(data.date) : ""}
          register={register}
          error={errors?.date}
          type="datetime-local"
        />
        <InputField
          label="Present"
          name="present"
          defaultValue={data?.present}
          register={register}
          error={errors?.present}
          type="checkbox"
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

export default AttendanceForm;
