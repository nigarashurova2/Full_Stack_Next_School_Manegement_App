"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import SelectField from "../SelectField";
import { Dispatch, SetStateAction, useEffect } from "react";
import { EventSchema, eventSchema } from "@/lib/formValidationSchemas";
import { Bounce, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { formatDateTimeLocal } from "./ExamForm";
import { useFormState } from "react-dom";
import { createEvent, updateEvent } from "@/lib/actions";

const EventForm = ({
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
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createEvent : updateEvent,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Event has been ${type === "create" ? "created" : "updated"}`,
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

  const { classes } = relatedData;
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
    <form action="" className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1>{type === "create" ? "Create a new event" : "Update a event"}</h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
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
          label="Class"
          register={register}
          name="classId"
          defaultValue={data?.classId}
          options={classOptions}
          multiple={false}
          error={errors?.classId}
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

export default EventForm;
