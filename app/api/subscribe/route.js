import { SubscribeEmail } from "@/lib/models/subscribeEmail"
import { NextResponse } from "next/server"
import isEmail from 'validator/lib/isEmail';
import connectDb from "@/lib/mongoose"

export async function POST(req) {
    try {
        const { emailId } = await req.json()
        if (!emailId || emailId?.trim()?.length == 0 || !isEmail(emailId)) return NextResponse.json({ success: false, message: "Invalid Input" }, { status: 422 })
        await connectDb()
        const checkExist = await SubscribeEmail.findOne({ email: emailId })
        if (checkExist) return NextResponse.json({ success: false, message: "Email is already subscibed" }, { status: 208 })
        const newDoc = new SubscribeEmail({
            email: emailId
        })
        await newDoc.save()
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Unable to subscribe" }, { status: 500 })
    }
}

export async function DELETE(req) {
    try {
        const { emailId } = await req.json()
        if (!emailId || emailId?.trim()?.length == 0 || !isEmail(emailId)) return NextResponse.json({ success: false, message: "Invalid Input" }, { status: 422 })
        const decodedEmail = decodeURIComponent(emailId)
        await connectDb()
        await SubscribeEmail.deleteOne({ email: decodedEmail })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Unable to unsubscribe" }, { status: 500 })
    }
}