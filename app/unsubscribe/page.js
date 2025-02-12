"use client"
import { useToast } from '@/hooks/use-toast'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
    const searchParams = useSearchParams()
    const emailId = searchParams.get('emailId')
    const [status, setStatus] = useState({ status: "❕", message: "Processing" })
    const { toast } = useToast()

    useEffect(() => {
        (async () => {
            try {
                const req = await fetch(`/api/unsubscribe`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ emailId: emailId })
                })
                if (!req.ok) {
                    throw new Error("Error during fetching Admin details!");
                }
                const res = await req.json()
                if (res.success) {
                    setStatus({ status: "✅", message: "Done.." })
                } else {
                    setStatus({ status: "❌", message: "Server Error" })
                    throw new Error("Unable to Unsubscribe!");
                }
            } catch (error) {
                toast({
                    title: `❌ ${error.message}`,
                    description: `Write your issue in footer!`,
                })
            }
        })()
    }, [])

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <span className='text-3xl font-bold'>{status.status} {status.message}</span>
        </div>
    )
}

export default page