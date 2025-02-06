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
  const [htmlContent,setHtmlContent] = useState("")

  useEffect(() => {
    (async () => {
      const req = await fetch(`/api/fetchBlog`, {
        method: "POST",
        headers: {
          "Content-Type": "applicaion/json"
        },
        body: JSON.stringify({ id: id })
      })
      const res = await req.json()
      if (!res.success) {
        toast({
          title: `❌ ${res.message}`,
        })
        return;
      }
      console.log(res.data)
      setBlogData(res.data)
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
      <div className="w-[50%] min-h-screen flex flex-col gap-8 m-5">
        <div className="mx-3 flex flex-col gap-3 text-center">
          <h1 className="text-4xl font-bold px-10">{blogdata?.title}</h1>
          <p className="font-semibold">{formatTimestamp(blogdata?.publishedTime)}</p>
        </div>
        <div className="line w-full border-b"></div>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="prose dark:prose-invert"></div>
      </div>
    </div>
  )
}
