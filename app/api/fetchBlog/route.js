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
        if (!getBlog) return NextResponse.json({ success: false, message: "No Post Found!" })
        return NextResponse.json({ success: true, data: getBlog })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server Error!" })
    }
}