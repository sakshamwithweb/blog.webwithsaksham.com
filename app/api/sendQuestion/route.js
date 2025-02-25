import { Question } from "@/lib/models/question";
import connectDb from "@/lib/mongoose";
import { NextResponse } from "next/server";
import DOMPurify from "isomorphic-dompurify";

export async function POST(req) {
    try {
        const { question } = await req.json();
        const sanitizedQuestion = DOMPurify.sanitize(question);
        if (!sanitizedQuestion || sanitizedQuestion?.trim()?.length == 0) return NextResponse.json({ success: false, message: "Invalid Input" }, { status: 422 })
        await connectDb()
        const newQ = new Question({
            question: sanitizedQuestion
        })
        await newQ.save()
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Unable to send question" }, { status: 500 })
    }
}