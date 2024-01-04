"use client";

import { useSearchParams } from "next/navigation";

import { Editor } from "src/app/components/Editor";
import { ArticleType } from "../../types";
// import { getArticle } from "../../utils/article";

export default function Home() {
  const testData: ArticleType[] = [
    {
      _id: "10001",
      title: "テスト記事10001",
      mainCategory: "fresher",
      subCategory: "テスト1",
      date: "2021/04/01",
      content: "テスト記事です#1",
      shown: true,
    },
    {
      _id: "10002",
      title: "テスト記事10002",
      mainCategory: "circle",
      subCategory: "テスト2",
      date: "2021/04/02",
      content: "テスト記事です#2",
      shown: false,
    },
    {
      _id: "10003",
      title: "テスト記事10003",
      mainCategory: "committee",
      subCategory: "テスト3",
      date: "2021/04/03",
      content: "テスト記事です#3",
      shown: false,
    },
  ];

  const id = useSearchParams().get("id");
  console.log(id);

  // local
  const getArticle = (id: any) => {
    return testData.find((e) => e._id == id);
  };

  const article = id && typeof id === "string" ? getArticle(id) : undefined;

  return (
    <div>
      <Editor initialData={article} edit={Boolean(article)} />
    </div>
  );
}
