import { SubscribeEmail } from "@/lib/models/subscribeEmail"
import connectDb from "@/lib/mongoose"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const { emailId } = await req.json()
        const decodedEmail = decodeURIComponent(emailId)
        await connectDb()
        await SubscribeEmail.deleteOne({ email: decodedEmail })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false })
    }
}