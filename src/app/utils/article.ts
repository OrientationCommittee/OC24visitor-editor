import { MainCategoryType, ArticleType, ArticleTitleType } from "../types";

//通信系
//APIから記事の全てを取得する関数.
export async function getArticles(): Promise<ArticleType[]> {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(url as string, { cache: "no-store" });
  return await response.json();
}

//APIから記事の一部を取得する関数.idは全記事取得の関数で得た_idを指定する.
export async function getArticle(id: string): Promise<ArticleType> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/id/${id}`;
  const response = await fetch(url, { cache: "no-store" });
  return await response.json();
}

//APIから記事の一部をtitleによって取得する関数.
export async function getArticleByTitle(title: string): Promise<ArticleType> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/title/${title}`;
  const response = await fetch(url, { cache: "no-store" });
  return await response.json();
}

//APIに記事を追加する関数.引数には_idと_vはいらない.
export async function postArticle(article: ArticleType): Promise<Response> {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(url as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(article),
    cache: "no-store",
  });
  return response;
}

//APIの記事を更新する関数.
export async function updateArticle(id: string, article: ArticleType): Promise<Response> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/id/${id}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(article),
    cache: "no-store",
  });
  return response;
}
//APIの記事をtitleで指定して更新する関数.
export async function updateArticleByTitle(title: string, article: ArticleType): Promise<Response> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/title/${title}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(article),
    cache: "no-store",
  });
  return response;
}

//APIの記事を削除する関数.idは全記事取得の関数で得た_idを指定する.
export async function deleteArticle(id: string): Promise<Response> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/id/${id}`;
  const response = await fetch(url, {
    method: "DELETE",
    cache: "no-store",
  });
  return response;
}

//idとタイトル一覧を取得する関数.
export async function getTitles(): Promise<ArticleTitleType[]> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/title`;
  const response = await fetch(url as string, { cache: "no-store" });
  return await response.json();
}

//便利系.引数には上記関数で得た記事を入れる.
//記事のmainCategory別subCategory一覧を取得する関数.
export function getSubCategories(articles: ArticleType[]): Record<string, string[]> {
  /**
   * todo: あとで修正する.
   */
  const subCategories: Record<MainCategoryType, Set<string>> = {
    fresher: new Set([]),
    oriter: new Set([]),
    circle: new Set([]),
    committee: new Set([]),
  };
  articles.forEach((article) => {
    subCategories[article.mainCategory].add(article.subCategory);
  });
  return Object.fromEntries(
    Object.entries(subCategories).map(([key, value]) => [key, Array.from(value)])
  );
}

//getTitlesからtitleの配列を抽出する関数.
export function getTitlesArray(titles: ArticleTitleType[]): string[] {
  const titlesArray: string[] = [];
  titles.forEach((title) => {
    titlesArray.push(title.title);
  });
  return titlesArray;
}
