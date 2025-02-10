"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { CircleHelp, EllipsisVertical, Filter, Kanban, Link2Icon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const FilterPlaceholder = () => (
  <div className='flex p-2 w-[150px] justify-center gap-5'>
    <p className='text-lg font-bold'>Filter</p>
    <Filter />
  </div>
);


const Page = () => {
  const [blogsData, setBlogsData] = useState(null)
  const [selectedBlogData, setSelectedBlogData] = useState(null)
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState("")
  const [emailForSubscribe, setEmailForSubscribe] = useState("")
  const [busySubscribeBtn,setBusySubscribeBtn] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    (async () => {
      try {
        const req = await fetch(`/api/fetchAllBlogs`, {
          method: "POST",
          headers: {
            "Content-Type": "applicaion/json"
          },
          body: JSON.stringify({})
        })
        const res = await req.json()
        if (res.success) {
          setBlogsData(res.data)
          setSelectedBlogData(res.data)
        } else {
          toast({
            title: "❌ Something Went Wrong",
            description: "Server Error!!",
          })
        }
      } catch (error) {
        toast({
          title: "❌ Something Went Wrong",
          description: "Server Error!!",
        })
      }
    })()
  }, [])


  useEffect(() => {
    (async () => {
      try {
        const req = await fetch(`/api/fetchCategories`, {
          method: "POST",
          headers: {
            "Content-Type": "applicaion/json"
          },
          body: JSON.stringify({})
        })
        const res = await req.json()
        if (!res.success) {
          toast({
            title: "❌ Unable to fetch categories!!"
          })
          return
        }
        setCategories(res.data)
      } catch (error) {
        toast({
          title: "❌ Unable to fetch categories!!"
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
        toast({
          title: "❌ Enter valid email!!"
        })
        return
      }
      setBusySubscribeBtn(true)
      const req = await fetch(`/api/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "applicaion/json"
        },
        body: JSON.stringify({ emailId: emailForSubscribe })
      })
      const res = await req.json()
      if (!res.success) {
        toast({
          title: "❌ Unable to Subscribe!!"
        })
        setBusySubscribeBtn(false)
        return
      }
      toast({
        title: "✅ Subscribed!!"
      })
      setBusySubscribeBtn(false)
    } catch (error) {
      toast({
        title: "❌ Unable to Subscribe!!"
      })
    }
  }


  if (!blogsData) {
    return <p className='m-2 text-center'>Loading...</p>
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
          <SelectTrigger className="w-[180px]">
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
        <div className=''>
          <div className='flex items-center gap-2'>
            <div>
              <Label htmlFor="subscribe">Subscribe</Label>
              <Input type="email" value={emailForSubscribe} onChange={(e) => { setEmailForSubscribe(e.target.value) }} name="subscribe" id="subscribe" placeholder="Enter Email id" />
            </div>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger><CircleHelp /></TooltipTrigger>
                  <TooltipContent>
                    <p>Get Email when new post is posted by Saksham!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <Button disabled={busySubscribeBtn} className="w-14" onClick={handleSubscribe}>Save</Button>
        </div>
      </div>
      <div className='flex flex-col gap-6 w-full items-center'>
        {selectedBlogData.map((item, index) => {
          return (
            <div className='border h-16 relative w-11/12 rounded-2xl flex justify-between items-center' key={index}>
              <div className='overflow-auto h-full md:mr-2 md:ml-2 mr-10 ml-2 scrollbar-thin border-r w-[95%] flex text-lg items-center'>
                <Link href={`https://blog.webwithsaksham.com/${item.id}`} className='mx-2 whitespace-nowrap'>{item.title}</Link>
              </div>
              <div className='absolute top-4 right-2'>
                <DropdownMenu>
                  <DropdownMenuTrigger><EllipsisVertical /></DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => {
                      navigator.clipboard.writeText(`https://blog.webwithsaksham.com/${item.id}`).then(() => {
                        toast({ description: `✅ Copied` });
                      })
                        .catch(() => {
                          toast({ description: `❌ Something went wrong` });
                        });
                    }}>Save Link<Link2Icon /></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Page