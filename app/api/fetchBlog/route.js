import { Post } from "@/lib/models/post"
import connectDb from "@/lib/mongoose"
import { NextResponse } from "next/server"
import DOMPurify from "isomorphic-dompurify";

export async function POST(req) {
    try {
        const { id } = await req.json()
        const sanitizedId = DOMPurify.sanitize(id);
        await connectDb()
        const getBlog = await Post.findOne({ _id: sanitizedId })
        if (!getBlog) throw new Error("No post is there");        
        return NextResponse.json({ success: true, data: getBlog })
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ success: false, message: "Server Error!" })
    }
}