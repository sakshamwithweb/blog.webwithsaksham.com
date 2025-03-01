import { Post } from "@/lib/models/post"
import connectDb from "@/lib/mongoose"
import { NextResponse } from "next/server"
import DOMPurify from "isomorphic-dompurify";

export async function POST(req) {
    try {
        const { postId } = await req.json()
        const sanitizedId = DOMPurify.sanitize(postId);
        await connectDb()
        const getBlog = await Post.findOne({ _id: sanitizedId })
        if (!getBlog) return NextResponse.json({ success: false, message: "No Post Found!" }, { status: 404 })
        return NextResponse.json({ success: true, data: getBlog })
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ success: false, message: "Unable to fetch blog" }, { status: 500 })
    }
}