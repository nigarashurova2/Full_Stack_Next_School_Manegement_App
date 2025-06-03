"use server";

import { revalidatePath } from "next/cache";
import { ClassSchema, SubjectSchema, TeacherSchema } from "./formValidationSchemas";
import prisma from "./prisma";

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
    console.log(data, "data");

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
    console.log(id, "dd");

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
      data: {}
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

    await prisma.teacher.update({
      where: { id: data.id },
      data: data,
    });

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
      where: { id: id},
    });

    // revalidatePath("/list/subject");
    return { success: true, error: false, message: "SUCCESS" };
  } catch (error) {
    return { success: false, error: true, message: "Something went wrong! " };
  }
};