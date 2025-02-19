import { Post } from "@/lib/models/post";
import connectDb from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectDb()
        const posts = await Post.find({})
        if (!posts) throw new Error("not found");        
        return NextResponse.json({ success: true, data: posts })
    } catch (error) {
        return NextResponse.json({ success: false })
    }
}