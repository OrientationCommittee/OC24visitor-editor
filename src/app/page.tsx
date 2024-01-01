export default function Home() {
  const categories: { [key: string]: string } = {
    newcomer: "新入生の方へ",
    oriter: "オリターの方へ",
    circle: "サークルの方へ",
    committee: "当委員会について",
  };
  const testData: {
    title: string; // 記事タイトル (pathにもなる)
    category: (typeof categories)[number]; // 大枠のカテゴリ
    subCategory: string; // 各ページ内で見出しでまとめる用
    date: string; // 更新日
    article: string; // html形式
    shown: boolean; // 公開するかどうか
  }[] = [
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
  return (
    <div>
      <h1 className="font-bold text-3xl mb-8">記事一覧</h1>
      <div className="flex justify-between">
        {Object.keys(categories).map((key) => {
          const subCategories: string[] = Array.from(
            new Map(
              testData
                .filter((e) => e.category === categories[key])
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
                              e.category === categories[key] &&
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
