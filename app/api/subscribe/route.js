import { SubscribeEmail } from "@/lib/models/subscribeEmail"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const { emailId } = await req.json()
        const newDoc = new SubscribeEmail({
            email:emailId
        })
        await newDoc.save()
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({success:false})
    }
}