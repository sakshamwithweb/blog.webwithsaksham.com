"use client"
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
    const searchParams = useSearchParams()
    const emailId = searchParams.get('emailId')
    const [status,setStatus] = useState({status:"❕",message:"Processing"})

    useEffect(() => {
        (async () => {
            const req = await fetch(`/api/unsubscribe`, {
                method: "POST",
                headers: {
                    "Content-Type": "applicaion/json"
                },
                body: JSON.stringify({ emailId: emailId })
            })
            const res = await req.json()
            if (!res.success) {
                toast({
                    title: "❌ Unable to Unsubscribe!!"
                })
                setStatus({status:"❌",message:"Server Error"})
                return;
            }
            setStatus({status:"✅",message:"Done.."})
        })()
    }, [])

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <span className='text-3xl font-bold'>{status.status} {status.message}</span>
        </div>
    )
}

export default page