"use client"
import Link from 'next/link'
import React from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ModeToggle } from './ui/mode'
import { Tooltip as ReactTooltip } from 'react-tooltip'

const Navbar = () => {
  return (
    <nav className='flex mx-auto sticky top-0 p-2 md:p-2 justify-between items-center backdrop-blur border border-b-gray-400/50 z-50'>
      <div className='font-bold text-xl mx-2 md:mx-4'>
        <Link href={"http://webwithsaksham.com"}>SakshamWithWeb</Link>
      </div>
      <div className='flex'>
        <span data-tooltip-id="mode-toggle" className='hidden md:block'> <ModeToggle /></span>
        {/*For Smaller device*/}
        <div className='md:hidden'>
          <span data-tooltip-id="mode-toggle" className='mx-4'> <ModeToggle /></span>
          <Sheet>
            <SheetTrigger aria-label='hamburger'>
              <RxHamburgerMenu />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>SakshamWithWeb</SheetTitle>
                <SheetDescription>
                  <Link className='' href={`/`}>Home</Link>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>

        {/*For biger device*/}
        <ul className='md:flex md:mt-2 gap-3 mx-4 hidden'>
          <li><Link href={`/`}>Home</Link></li>
        </ul>
      </div>
      <ReactTooltip
        id="mode-toggle"
        content="Switch the mode"
      />
    </nav >
  )
}

export default Navbar
