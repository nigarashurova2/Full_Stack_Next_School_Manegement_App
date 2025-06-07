"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import SelectField from "../SelectField";
import FileInputField from "../FileInputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  AnnouncementSchema,
  announcementSchema,
} from "@/lib/formValidationSchemas";
import { Bounce, toast } from "react-toastify";
import { createAnnouncement, updateAnnouncement } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { formatDateTimeLocal } from "./ExamForm";

const AnnouncementForm = ({
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
  } = useForm<AnnouncementSchema>({
    resolver: zodResolver(announcementSchema),
  });

  const router = useRouter();
  const [state, formAction] = useFormState(
    type === "create" ? createAnnouncement : updateAnnouncement,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Announcement has been ${type === "create" ? "created" : "updated"}`,
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

  const onSubmit = handleSubmit((data: AnnouncementSchema) => {
    formAction(data);
  });

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
      <h1>
        {type === "create"
          ? "Create a new announcement"
          : "Update a nnouncement"}
      </h1>
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
          error={errors.description}
        />

        <InputField
          label="Date"
          name="date"
          defaultValue={data?.date ? formatDateTimeLocal(data.date) : ""}
          register={register}
          error={errors?.date}
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

export default AnnouncementForm;
