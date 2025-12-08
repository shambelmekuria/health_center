import { cookies } from "next/headers";
const TOKEN_AGE = 3600
const TOKEN_NAME = 'access-token'
const REFRESH_TOKEN_NAME = 'refresh-token'

// API Request Needed

export async function getToken() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(TOKEN_NAME);
  return authToken?.value;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(REFRESH_TOKEN_NAME);
  return authToken?.value;
}

// Set acess and refesh token when login

export async function setToken(token: string) {
  const cookieStore = await cookies();
  return cookieStore.set({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: TOKEN_AGE,
  });
}


export async function setRefreshToken(token: string) {
  const cookieStore = await cookies();
  return cookieStore.set({
    name: REFRESH_TOKEN_NAME,
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 3600,
  });
}



// Delete Token For logout
export async function deleteToken() {
  const cookieStore = await cookies();
  cookieStore.delete(REFRESH_TOKEN_NAME);
  return cookieStore.delete(TOKEN_NAME);
}
