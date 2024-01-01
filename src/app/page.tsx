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
  }[] = [
    {
      title: "テスト記事1",
      category: "新入生の方へ",
      subCategory: "テスト1",
      date: "2021/04/01",
      article: "テスト記事です",
    },
    {
      title: "テスト記事3",
      category: "新入生の方へ",
      subCategory: "テスト1",
      date: "2021/04/01",
      article: "テスト記事です",
    },
    {
      title: "テスト記事2",
      category: "新入生の方へ",
      subCategory: "テスト2",
      date: "2021/04/01",
      article: "テスト記事です",
    },
  ];
  return (
    <div className="">
      <div className="flex items-center">
        <h1 className="font-bold text-2xl">記事一覧</h1>
        
      </div>
    </div>
  );
}
