"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import SelectField from "../SelectField";
import FileInputField from "../FileInputField";
import { subjectSchema, SubjectSchema, TeacherSchema } from "@/lib/formValidationSchemas";
import { createSubject, updateSubject } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Bounce, toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SubjectForm = ({
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
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createSubject : updateSubject,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  const onSubmit = handleSubmit((data: SubjectSchema) => {
    formAction(data);
  });
  const router = useRouter();

  useEffect(() => {
    
    if (state.success) {
      toast.success(
        `Subject has been ${type === "create" ? "created" : "updated"}`,
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
  }, [state]);

  const teacherOptions = relatedData.teachers.map(
    (item: { id: number; name: string; surname: string }) => ({
      label: item.name + " " + item.surname,
      val: item.id,
    })
  );

  return (
    <form action="" className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1>{type === "create" ? "Create a new subject" : "Update a subject"}</h1>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <InputField
          label="Subject Name"
          type="text"
          register={register}
          name="name"
          defaultValue={data?.name}
          error={errors.name}
        />

        <SelectField
          label="Teachers"
          register={register}
          name="teachers"
          defaultValue={data?.teachers.map((teacher: TeacherSchema)=> teacher.id)}
          options={teacherOptions}
          multiple={true}
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

export default SubjectForm;
