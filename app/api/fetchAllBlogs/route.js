import { Post } from "@/lib/models/post";
import connectDb from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectDb()
        const posts = await Post.find({})
        if (!posts) return NextResponse.json({ success: false, message: "No post found" }, { status: 404 })
        return NextResponse.json({ success: true, data: posts })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Unable to fetch data" }, { status: 500 })
    }
}