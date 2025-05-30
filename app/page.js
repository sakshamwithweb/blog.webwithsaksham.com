"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { CircleHelp, EllipsisVertical, Filter, Link2Icon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import isEmail from 'validator/lib/isEmail';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/Loader'
import { getStatusMessage } from '@/lib/statusMessage'
import { generateToken } from '@/lib/generateToken'

const FilterPlaceholder = () => (
  <div className='flex md:p-2 justify-center gap-5'>
    <Filter />
  </div>
);


const Page = () => {
  const [blogsData, setBlogsData] = useState(null)
  const [selectedBlogData, setSelectedBlogData] = useState(null)
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState("")
  const [emailForSubscribe, setEmailForSubscribe] = useState("")
  const [busySubscribeBtn, setBusySubscribeBtn] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    (async () => {
      try {
        const { token, id } = await generateToken()
        const req = await fetch(`/api/fetchAllBlogs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ id })
        })
        if (!req.ok) {
          const statusText = await getStatusMessage(req.status)
          throw new Error(`Error ${req.status}: ${statusText}`);
        }
        const res = await req.json()
        if (res.success) {
          setBlogsData(res.data)
          setSelectedBlogData(res.data)
        } else {
          throw new Error("Something Went Wrong");
        }
      } catch (error) {
        toast({
          title: `❌ ${error.message}`,
          description: `Write your issue in footer!`,
        })
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const { token, id } = await generateToken()
        const req = await fetch(`/api/fetchCategories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ id })
        })
        if (!req.ok) {
          const statusText = await getStatusMessage(req.status)
          throw new Error(`Error ${req.status}: ${statusText}`);
        }
        const res = await req.json()
        if (res.success) {
          setCategories(res.data)
        } else {
          throw new Error("Unable to fetch categories!");
        }
      } catch (error) {
        toast({
          title: `❌ ${error.message}`,
          description: `Write your issue in footer!`,
        })
      }
    })()
  }, [])

  useEffect(() => {
    if (category !== "") {
      if (category != "all") {
        let specificArr = []
        blogsData.map((item) => {
          if (item.categoryValue == category) {
            specificArr.push(item)
          }
        })
        setSelectedBlogData(specificArr)
      } else {
        setSelectedBlogData(blogsData)
      }
    }
  }, [category])

  const handleSubscribe = async () => {
    try {
      if (emailForSubscribe.length == 0 || !isEmail(emailForSubscribe)) {
        throw new Error("Enter valid email");
      }
      setBusySubscribeBtn(true)
      const { token, id } = await generateToken()
      const req = await fetch(`/api/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ emailId: emailForSubscribe, id })
      })
      if (!req.ok) {
        const statusText = await getStatusMessage(req.status)
        throw new Error(`Error ${req.status}: ${statusText}`);
      }
      const res = await req.json()
      setBusySubscribeBtn(false)
      if (res.success) {
        toast({
          title: "✅ Subscribed!!",
          description: "You are successfully subscribed!"
        })
      } else {
        if (res?.message) {
          throw new Error(res.message);
        } else {
          throw new Error("Unable to Subscribe");
        }
      }
    } catch (error) {
      toast({
        title: `❌ ${error.message}`,
        description: `Write your issue in footer!`,
      })
    }
  }

  if (!blogsData) {
    return <Loader />
  } else if (blogsData.length == 0) {
    return (
      <div className='flex justify-center items-center gap-5'>
        <p className='m-2 text-center'>No Post is there</p>
      </div>
    )
  }

  return (
    <div className='relative min-h-screen flex flex-col items-center gap-6'>
      <h1 className='text-xl text-center font-bold'>Blogs</h1>
      <div className='w-full flex justify-around'>
        <Select value={category} onValueChange={(e) => setCategory(e)}>
          <SelectTrigger data-tooltip-id="filter" className="w-[80px] mt-6">
            <SelectValue placeholder={<FilterPlaceholder />} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              {categories.map((category, index) => {
                return <SelectItem key={index} value={category}>{category}</SelectItem>;
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className='flex items-center' data-tooltip-id="subscribe-what">
          <div>
            <Label htmlFor="subscribe">Subscribe</Label>
            <Input className="md:w-auto w-28" type="email" value={emailForSubscribe} onChange={(e) => { setEmailForSubscribe(e.target.value) }} name="subscribe" id="subscribe" placeholder="Enter Email id" />
          </div>
          <Button disabled={busySubscribeBtn} className="w-14 mt-6" onClick={handleSubscribe}>Save</Button>
        </div>
      </div>
      <div className='flex flex-col gap-6 w-full items-center'>
        {selectedBlogData.map((item, index) => {
          return (
            <div className='border h-16 relative w-11/12 rounded-2xl flex justify-between items-center' key={index}>
              <div className='overflow-auto h-full md:mr-2 md:ml-2 mr-10 ml-2 scrollbar-thin border-r w-[95%] flex text-lg items-center'>
                <Link href={`https://blog.webwithsaksham.com/${item._id}`} className='mx-2 whitespace-nowrap'>{item.title}</Link>
              </div>
              <div className='absolute top-4 right-2'>
                <DropdownMenu>
                  <DropdownMenuTrigger data-tooltip-id="menu"><EllipsisVertical /></DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => {
                      navigator.clipboard.writeText(`https://blog.webwithsaksham.com/${item._id}`).then(() => {
                        toast({ description: `✅ Copied` });
                      })
                        .catch(() => {
                          toast({
                            title: "❌ Something Went Wrong",
                            description: `Write your issue in footer!`,
                          })
                        });
                    }}>Save Link<Link2Icon /></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
      </div>

      <ReactTooltip
        id="filter"
        content="Filter"
      />
      <ReactTooltip
        id="subscribe-what"
        content="Get Email when new post is posted by Saksham!"
      />
      <ReactTooltip
        id="menu"
        content="Menu"
      />
    </div>
  )
}

export default Page