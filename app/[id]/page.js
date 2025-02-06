"use client"
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  // Fetch /api/fetchBlog then show here
  return <div>My Post: {id}</div>;
}
