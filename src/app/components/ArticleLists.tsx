"use client";

import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { ArticleType, MainCategoryType, categories_jp } from "../types";
import Link from "next/link";

const ArticleCard: FC<{ article: ArticleType }> = (props) => {
  const article: ArticleType = props.article;
  const content: string = article.shown
    ? "before:content-['●_表示']"
    : "before:content-['●_非表示']";
  const color: string = article.shown ? "before:text-green-500" : "before:text-slate-500";
  return (
    <div className="w-[20vw] border rounded mb-4" key={article.title}>
      <Link className="text-lg mb-4 relative" href={`/${article.title}/edit`}>
        <div className="p-4">
          <div
            className={[
              "font-semibold before:absolute before:text-[10px] before:right-2 before:bottom-0",
              content,
              color,
            ].join(" ")}
          >
            {article.title}
          </div>
          <div className="text-sm mt-2">最終更新 {article.date}</div>
        </div>
      </Link>
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
