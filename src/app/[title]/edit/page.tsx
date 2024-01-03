"use client";

import { Editor } from "src/app/components/Editor";
import { ArticleType } from "../../types";

import { useParams } from "next/navigation";

export default function Home() {
  const testData: ArticleType[] = [
    {
      title: "テスト記事1",
      mainCategory: "fresher",
      subCategory: "テスト1",
      date: "2021/04/01",
      article: "テスト記事です#1",
      shown: true,
    },
    {
      title: "テスト記事3",
      mainCategory: "circle",
      subCategory: "テスト3",
      date: "2021/04/03",
      article: "テスト記事です#3",
      shown: false,
    },
    {
      title: "テスト記事2",
      mainCategory: "committee",
      subCategory: "テスト2",
      date: "2021/04/02",
      article: "テスト記事です#2",
      shown: false,
    },
  ];

  const params = useParams();
  const titleEncoded = params.title as string;
  const article = testData.find(e => e.title == decodeURI(titleEncoded))
  //params.titleはエンコードされた状態で取得されるので日本語に戻す、keyにすれば必要ないかも

  return (
    <div>
      <Editor initialData={article} edit={true}/>
    </div>
  )
}
