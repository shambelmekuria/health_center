import { DJANGO_BASE_URL } from "@/app/config/defualt";
import {
  setRefreshToken,
  setToken,
} from "@/app/lib/auth";
import axios from "axios";
import { NextResponse } from "next/server";

const LOGIN_URL = `${DJANGO_BASE_URL}/api/token/`;
export async function POST(request: Request) {
  const data = await request.json();
  try {
    const response = await axios.post(LOGIN_URL, data);
    const { access, refresh } = response.data;
     
    await setToken(access);
    await setRefreshToken(refresh);
    return NextResponse.json({ login: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({}, { status: 401 });
  }
}



