"use client";

import { useParams } from "next/navigation";

import { ArticleDataProvider } from "./ArticleDataProvider";
import { Editor } from "src/app/components/Editor";

export default function Home() {
  const title = useParams().title as string;
  return <ArticleDataProvider title={title} Editor={Editor} />;
}
