import { Post } from "@/lib/models/post"
import connectDb from "@/lib/mongoose"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const { id } = await req.json()
        await connectDb()
        const getBlog = await Post.findOne({ _id: id })
        if (!getBlog) return NextResponse.json({ success: false, message: "No Post is there!" })
        return NextResponse.json({ success: true, data: getBlog })
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ success: false, message: "Server Error!" })
    }
}