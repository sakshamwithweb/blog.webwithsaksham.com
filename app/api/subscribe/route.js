import { SubscribeEmail } from "@/lib/models/subscribeEmail"
import { NextResponse } from "next/server"
import isEmail from 'validator/lib/isEmail';

export async function POST(req) {
    try {
        const { emailId } = await req.json()
        if (!emailId || emailId?.trim()?.length == 0 || !isEmail(emailId)) throw new Error("Enter valid email");
        const checkExist = await SubscribeEmail.findOne({ email: emailId })
        if (checkExist) return NextResponse.json({ success: false })
        const newDoc = new SubscribeEmail({
            email: emailId
        })
        await newDoc.save()
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false })
    }
}