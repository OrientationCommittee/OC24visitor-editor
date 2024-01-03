import { categories_jp, ArticleType, MainCategoryType } from "./types";
import { getArticles } from "./utils/article";

export default async function Home() {
  const articlesData: ArticleType[] = await getArticles();
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
                          .map((e) => {
                            return (
                              <div
                                className="w-[20vw] border rounded p-4 mb-4"
                                key={e.title}
                              >
                                <a
                                  className="font-semibold text-lg mb-4"
                                  href={`/${e.title}/edit`}
                                >
                                  {e.title}
                                </a>
                                <div className="text-sm mt-2">
                                  最終更新 {e.date}
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
        })}
      </div>
    </div>
  );
}
