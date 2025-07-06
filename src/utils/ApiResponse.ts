import { NextResponse } from "next/server";

export const ApiResponse = (success:boolean, message:string, status:number) => {
    return NextResponse.json({
        success, 
        message 
    }, { status });
};