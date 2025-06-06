"use server";

import { revalidatePath } from "next/cache";
import {
  ClassSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean; message: string };
export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subject");
    return { success: true, error: false, message: "SUCCESS" };
  } catch (error) {
    return { success: false, error: true, message: "Something wentt wrong! " };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: { id: data.id },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subject");
    return { success: true, error: false, message: "SUCCESS" };
  } catch (error) {
    return { success: false, error: true, message: "Something went wrong! " };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = data.get("id") as string;

    await prisma.subject.delete({
      where: { id: parseInt(id) },
    });

    // revalidatePath("/list/subject");
    return { success: true, error: false, message: "SUCCESS" };
  } catch (error) {
    return { success: false, error: true, message: "Something went wrong! " };
  }
};

// Class Actions
export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    console.log(data, "data");

    await prisma.class.create({
      data,
    });

    // revalidatePath("/list/subject");
    return { success: true, error: false, message: "SUCCESS" };
  } catch (error) {
    return { success: false, error: true, message: "Something wentt wrong! " };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.update({
      where: { id: data.id },
      data: data,
    });

    // revalidatePath("/list/subject");
    return { success: true, error: false, message: "SUCCESS" };
  } catch (error) {
    return { success: false, error: true, message: "Something went wrong! " };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = data.get("id") as string;
    console.log(id, "dd");

    await prisma.class.delete({
      where: { id: parseInt(id) },
    });

    // revalidatePath("/list/subject");
    return { success: true, error: false, message: "SUCCESS" };
  } catch (error) {
    return { success: false, error: true, message: "Something went wrong! " };
  }
};

// Teacher Actions
export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    console.log(data, "data");

    await prisma.teacher.create({
      data: {
        id: data.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        img: data.img || null,
        address: data.address,
        bloodType: data.bloodType,
        birthday: data.birthday,
        sex: data.sex,
        subjects: {
          connect: data.subjects.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false, message: "SUCCESS" };
  } catch (error) {
    return { success: false, error: true, message: "Something wentt wrong! " };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    // await prisma.teacher.update({
    //   where: { id: data.id },
    //   data: data,
    // });

    // revalidatePath("/list/teachers");
    return { success: true, error: false, message: "SUCCESS" };
  } catch (error) {
    return { success: false, error: true, message: "Something went wrong! " };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = data.get("id") as string;

    await prisma.teacher.delete({
      where: { id: id },
    });

    // revalidatePath("/list/subject");
    return { success: true, error: false, message: "SUCCESS" };
  } catch (error) {
    return { success: false, error: true, message: "Something went wrong! " };
  }
};


// Student Actions

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  console.log(data);
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true, message: "" };
    }

    const client = await clerkClient();
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata:{role:"student"}
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false, message:"" };
  } catch (err) {
    console.log(err);
    return { success: false, error: true, message:""};
  }
};


export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true, message:""};
  }
  try {
    const client = await clerkClient();
    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });
    // revalidatePath("/list/students");
    return { success: true, error: false, message:""};
  } catch (err) {
    console.log(err);
    return { success: false, error: true , message:""};
  }
};


export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false, message:"" };
  } catch (err) {
    console.log(err);
    return { success: false, error: true, message:"" };
  }
};