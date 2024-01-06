import { ArticleType } from "./types";
import { getArticles } from "./utils/article";
import { ArticleLists } from "./components/ArticleLists";

export default async function Home() {
  const articlesData: ArticleType[] = await getArticles();
  // console.log(articlesData); //ここに新規で送信した記事が出てこない

  return (
    <div className="pb-24">
      <h1 className="font-bold text-3xl mb-8">記事一覧</h1>
      <ArticleLists articlesData={articlesData} />
    </div>
  );
}
