"use client";

import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { ArticleType, MainCategoryType, categories_jp } from "../types";
import Link from "next/link";

const ArticleCard: FC<{ article: ArticleType }> = (props) => {
  const article: ArticleType = props.article;
  return (
    <div className="w-[20vw] border rounded p-4 mb-4" key={article.title}>
      <Link className="font-semibold text-lg mb-4" href={`/${article.title}/edit`}>
        {article.title}
      </Link>
      <div className="text-sm mt-2">最終更新 {article.date}</div>
    </div>
  );
};

export const ArticleLists = ({ articlesData }: { articlesData: ArticleType[] }) => {
  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, []);
  return (
    <div className="flex justify-between">
      {(Object.keys(categories_jp) as MainCategoryType[]).map((mainCategory) => {
        return (
          <div className="mr-4 w-[24vw]" key={mainCategory}>
            <Link className="font-semibold text-2xl mb-6" href={`#${mainCategory}`}>
              {categories_jp[mainCategory]}
            </Link>
            <div>
              <div className="mb-[-24px]">
                <Link className="text-base mb-10" href={`#${mainCategory}`}>
                  #{mainCategory}
                </Link>
              </div>
              {Array.from(
                new Map(
                  articlesData
                    .filter((e) => e.mainCategory === mainCategory)
                    .map((e) => [e.subCategory, e.subCategory])
                ),
                ([, v]) => v
              ).map((subCategory) => {
                return (
                  <div className="" key={subCategory}>
                    <div className="font-semibold text-xl mt-16 mb-4">{subCategory}</div>
                    <div>
                      {articlesData
                        .filter(
                          (e) => e.mainCategory === mainCategory && e.subCategory === subCategory
                        )
                        .map((article, i) => (
                          <ArticleCard key={i} article={article} />
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
