"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import SelectField from "../SelectField";
import { LessonSchema, lessonSchema } from "@/lib/formValidationSchemas";
import { Dispatch, SetStateAction, useEffect } from "react";
import { formatDateTimeLocal } from "./ExamForm";
import { useFormState } from "react-dom";
import { createLesson, updateLesson } from "@/lib/actions";
import { Bounce, toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LessonForm = ({
  setOpen,
  type,
  data,
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
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createLesson : updateLesson,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  const onSubmit = handleSubmit((data: LessonSchema) => {
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Lesson has been ${type === "create" ? "created" : "updated"}`,
        {
          position: "top-right",
          autoClose: 2000,
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

  const { subjects, classes, teachers } = relatedData;

  const teacherOptions = teachers.map(
    (item: { id: number; name: string; surname: string }) => ({
      label: item.name + " " + item.surname,
      val: item.id,
    })
  );

  const subjectOptions = subjects.map((item: { id: number; name: string }) => ({
    label: item.name,
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

  const dayOptions = [
    { label: "Monday", val: "MONDAY" },
    { label: "Tuesday", val: "TUESDAY" },
    { label: "Wednesday", val: "WEDNESDAY" },
    { label: "Thursday", val: "THURSDAY" },
    { label: "Friday", val: "FRIDAY" },
  ];

  return (
    <form action="" className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1>{type === "create" ? "Create a new lesson" : "Update a lesson"}</h1>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <InputField
          label="Name"
          type="text"
          register={register}
          name="name"
          defaultValue={data?.name}
          error={errors.name}
        />
        <SelectField
          label="Day"
          register={register}
          name="day"
          defaultValue={data?.day}
          options={dayOptions}
          multiple={false}
          error={errors?.day}
        />
        <InputField
          label="Start Date"
          name="startTime"
          defaultValue={
            data?.startTime ? formatDateTimeLocal(data.startTime) : ""
          }
          register={register}
          error={errors?.startTime}
          type="datetime-local"
        />
        <InputField
          label="End Date"
          name="endTime"
          defaultValue={data?.endTime ? formatDateTimeLocal(data.endTime) : ""}
          register={register}
          error={errors?.endTime}
          type="datetime-local"
        />
        <SelectField
          label="Subject"
          register={register}
          name="subjectId"
          defaultValue={data?.subjectId}
          options={subjectOptions}
          multiple={false}
          error={errors?.subjectId}
        />

        <SelectField
          label="Class"
          register={register}
          name="classId"
          defaultValue={data?.classId}
          options={classOptions}
          multiple={false}
          error={errors?.classId}
        />

        <SelectField
          label="Teacher"
          register={register}
          name="teacherId"
          defaultValue={data?.teacherId}
          options={teacherOptions}
          multiple={false}
          error={errors?.teacherId}
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

export default LessonForm;
