import { auth } from "@clerk/nextjs/server";

export const getRole = async () => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as {role: string})?.role;
  return role
};

export const currentUserId = async () => {
  const { userId } = await auth();
  return userId
};
