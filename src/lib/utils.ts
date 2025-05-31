import { auth } from "@clerk/nextjs/server";

export const getRole = async () => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as {role: string})?.role;
  return role
};

export const currentUserId = async () => {
  const { userId } = await auth();
  return userId as string
};

export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent'
} as const;

export type Role = "admin" | "teacher" | "student" | "parent";