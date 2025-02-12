"use client"
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from '@rehype-pretty/transformers'

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const options = { month: 'long', day: 'numeric', year: 'numeric' };

  let formattedDate = date.toLocaleDateString('en-US', options);

  // Add 'st', 'nd', 'rd', or 'th' to the day
  const day = date.getDate();
  const suffix = (day % 10 === 1 && day !== 11) ? 'st' :
    (day % 10 === 2 && day !== 12) ? 'nd' :
      (day % 10 === 3 && day !== 13) ? 'rd' : 'th';

  return formattedDate.replace(/\d+/, day + suffix);
}

export default function Page() {
  const { id } = useParams();
  const [blogdata, setBlogData] = useState(null)
  const { toast } = useToast()
  const [htmlContent, setHtmlContent] = useState("")

  useEffect(() => {
    (async () => {
      try {
        const req = await fetch(`/api/fetchBlog`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id: id })
        })
        if (!req.ok) {
          throw new Error("Error during fetching Admin details!");
        }
        const res = await req.json()
        if (res.success) {
          setBlogData(res.data)
        } else {
          throw new Error("Something went wrong!");
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
    if (blogdata?.content) {
      const processData = async () => {
        const processor = unified()
          .use(remarkParse)
          .use(remarkRehype)
          .use(rehypeDocument, { title: '👋🌍' })
          .use(rehypeFormat)
          .use(rehypeStringify)
          .use(rehypePrettyCode, {
            theme: "github-dark",
            transformers: [
              transformerCopyButton({
                visibility: 'always',
                feedbackDuration: 3_000,
              }),
            ],
          })
        const content = (await processor.process(blogdata?.content)).toString()
        setHtmlContent(content)
      }
      processData()
    }
  }, [blogdata])


  if (!blogdata) {
    return <p className="text-center text-3xl">Loading...</p>
  }
  return (
    <div className="min-h-screen flex justify-center">
      <div className="md:w-[50%] min-h-screen flex flex-col gap-8 md:m-5 m-3">
        <div className="md:mx-3 flex flex-col gap-3 text-center">
          <h1 className="md:text-4xl text-2xl font-bold px-10">{blogdata?.title}</h1>
          <p className="font-semibold">{formatTimestamp(blogdata?.publishedTime)}</p>
        </div>
        <div className="line w-full border-b"></div>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="prose dark:prose-invert"></div>
      </div>
    </div>
  )
}
