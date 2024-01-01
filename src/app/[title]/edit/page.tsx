"use client";

import { Editor } from "src/app/components/Editor";
import { articleType } from "../../plugins/HtmlToolbarPlugin";

import { useParams } from "next/navigation";

export default function Home() {
  const testData: articleType[] = [
    {
      title: "テスト記事1",
      category: "新入生の方へ",
      subCategory: "テスト1",
      date: "2021/04/01",
      article: "テスト記事です",
      shown: true,
    },
    {
      title: "テスト記事3",
      category: "新入生の方へ",
      subCategory: "テスト1",
      date: "2021/04/01",
      article: "テスト記事です",
      shown: true,
    },
    {
      title: "テスト記事2",
      category: "新入生の方へ",
      subCategory: "テスト2",
      date: "2021/04/01",
      article: "テスト記事です",
      shown: true,
    },
  ];

  const params = useParams();
  const titleEncoded = params.title as string;
  const article = testData.find(e => e.title == decodeURI(titleEncoded))
  //params.titleはエンコードされた状態で取得されるので日本語に戻す、keyにすれば必要ないかも

  return (
    <div>
      <Editor initialData={article}/>
    </div>
  )
}
