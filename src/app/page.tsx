import { FC } from "react";
import { categories, ArticleType } from "./types";

const ArticleCard: FC<{articleData: ArticleType}> = (props) => {
  const articleData = props.articleData;
  return <div
    className="w-[20vw] h-32 border rounded p-4 mb-1 flex flex-col justify-between"
    key={articleData.title}
    >
      <a
        className="font-semibold text-lg mb-1"
        href={`/${articleData.title}/edit`}
      >
        {articleData.title}
      </a>
      <ul className="list-disc list-inside text-sm">
        <li>#{articleData.mainCategory}</li>
        <li>{articleData.subCategory}</li>
      </ul>
      <div className="text-sm mt-2">
        <p className="text-right">最終更新 {articleData.date}</p>
      </div>
    </div>
}

export default function Home() {
  const testData: ArticleType[] = [
    {
      title: "テスト記事1",
      mainCategory: "fresher",
      subCategory: "テスト1",
      date: "2021/04/01",
      article: "テスト記事です",
      shown: true,
    },
    {
      title: "テスト記事3",
      mainCategory: "oriter",
      subCategory: "テスト1",
      date: "2021/04/01",
      article: "テスト記事です",
      shown: true,
    },
    {
      title: "テスト記事2",
      mainCategory: "committee",
      subCategory: "テスト2",
      date: "2021/04/01",
      article: "テスト記事です",
      shown: true,
    },
  ];
  return (
    <div>
      <h1 className="font-bold text-3xl mb-8">記事一覧</h1>
      <div className="flex justify-between">
        {Object.keys(categories).map((key) => {
          const subCategories: string[] = Array.from(
            new Map(
              testData
                .filter((e) => e.mainCategory === key)
                .map((e) => [e.subCategory, e.subCategory])
            ),
            ([, v]) => v
          );

          return (
            <div className="mr-4 w-[24vw]" key={key}>
              <a className="font-semibold text-2xl mb-6" href={`#${key}`}>
                {categories[key]}
              </a>
              <div>
                <div className="mb-[-24px]">
                  <a className="text-base mb-10" href={`#${key}`}>
                    #{key}
                  </a>
                </div>
                {subCategories.map((subCategory) => {
                  return (
                    <div className="" key={subCategory}>
                      <div className="font-semibold text-xl mt-16 mb-4">
                        {subCategory}
                      </div>
                      <div>
                        {testData
                          .filter(
                            (e) =>
                              e.mainCategory === key &&
                              e.subCategory === subCategory
                          )
                          .map((e, index) => <ArticleCard key={index} articleData={e}/>)}
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
