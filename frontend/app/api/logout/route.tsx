import { deleteToken, getToken } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await deleteToken();
    const token = await getToken()
    console.log("token",token)
    return NextResponse.json({"logout":true},{status:200})
}