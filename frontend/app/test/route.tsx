import { NextResponse } from "next/server";
import { getToken } from "../lib/auth";
import { jwtDecode } from "jwt-decode";

export async function GET(request:Request) {
    const token = await getToken()
    type jwtPayload ={
        id:string,
        role:string
    }
    const strtoken = String(token)
    const decoded = jwtDecode<jwtPayload>(strtoken);
    console.log(decoded?.role)
    
    return NextResponse.json({token : await getToken()},{status:200})
}