import Link from "next/link";
import { FC } from "react";

import { categories_jp, ArticleType, MainCategoryType } from "./types";

const ArticleCard:FC<{article: ArticleType}> = (props) => {
  const article: ArticleType = props.article;
  return (
    <div
      className="w-[20vw] border rounded p-4 mb-4"
      key={article.title}
    >
      <Link
        className="font-semibold text-lg mb-4"
        href={{pathname: `/${article.title}/edit`, query: {id: article._id}}}
        as={`/${article.title}/edit`}
      >
        {article.title}
      </Link>
      <div className="text-sm mt-2">
        最終更新 {article.date}
      </div>
    </div>
)}

export default async function Home() {
  // const articlesData: ArticleType[] = await getArticles();
  // local
  const articlesData: ArticleType[] = [
    {
      _id: "10001",
      title: "テスト",
      date: "2020/12/07",
      mainCategory: "oriter",
      subCategory: "サブカテゴリだよ",
      content: "<p>にゃあ</p>",
      shown: false,
      _v: 1,
    }
  ]
  return (
    <div>
      <h1 className="font-bold text-3xl mb-8">記事一覧</h1>
      <div className="flex justify-between">
        {(Object.keys(categories_jp) as MainCategoryType[]).map((mainCategory) => {
          const subCategories: string[] = Array.from(
            new Map(
              articlesData
                .filter((e) => e.mainCategory === mainCategory)
                .map((e) => [e.subCategory, e.subCategory])
            ),
            ([, v]) => v
          );

          return (
            <div className="mr-4 w-[24vw]" key={mainCategory}>
              <a className="font-semibold text-2xl mb-6" href={`#${mainCategory}`}>
                {categories_jp[mainCategory]}
              </a>
              <div>
                <div className="mb-[-24px]">
                  <a className="text-base mb-10" href={`#${mainCategory}`}>
                    #{mainCategory}
                  </a>
                </div>
                {subCategories.map((subCategory) => {
                  return (
                    <div className="" key={subCategory}>
                      <div className="font-semibold text-xl mt-16 mb-4">
                        {subCategory}
                      </div>
                      <div>
                        {articlesData
                          .filter(
                            (e) =>
                              e.mainCategory === mainCategory &&
                              e.subCategory === subCategory
                          )
                          .map((article, i) => <ArticleCard key={i} article={article}/>)
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
