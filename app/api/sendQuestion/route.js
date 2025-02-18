import { Question } from "@/lib/models/question";
import connectDb from "@/lib/mongoose";
import { NextResponse } from "next/server";
import DOMPurify from "isomorphic-dompurify";

export async function POST(req) {
    try {
        const { question } = await req.json();
        const sanitizedQuestion = DOMPurify.sanitize(question);
        if (!sanitizedQuestion || sanitizedQuestion?.trim()?.length == 0) throw new Error("Enter valid question");
        await connectDb()
        const newQ = new Question({
            question: sanitizedQuestion
        })
        await newQ.save()
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message })
    }
}