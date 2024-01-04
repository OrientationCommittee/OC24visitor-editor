import {MainCategoryType, ArticleType} from "../types";

//通信系
//APIから記事の全てを取得する関数.
export async function getArticles(): Promise<ArticleType[]> {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(url as string);
  return await response.json()
}

//APIから記事の一部を取得する関数.idは全記事取得の関数で得た_idを指定する.
export async function getArticle(id: string): Promise<ArticleType> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/${id}`;
  const response = await fetch(url);
  return await response.json()
}

//APIに記事を追加する関数.引数には_idと_vはいらない.
export async function postArticle(article: ArticleType) {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(url as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(article)
  })
  return await response.json()
}

//APIの記事を更新する関数.引数には_idと_vはいらない.
export async function putArticle(id: string, article: ArticleType) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/${id}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(article)
  })
  return await response.json()
}

//APIの記事を削除する関数.idは全記事取得の関数で得た_idを指定する.
export async function deleteArticle(id: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/${id}`;
  const response = await fetch(url, {
    method: 'DELETE'
  })
  return await response.json()
}

//便利系.引数には上記関数で得た記事を入れる.
//記事のmainCategory別subCategory一覧を取得する関数.
export function getSubCategories(articles: ArticleType[]): Record<string,string[]> {
  const subCategories: Record<MainCategoryType,string[]> = {
    fresher: [],
    oriter: [],
    circle: [],
    committee: []
  };
  articles.forEach((article) => {
    subCategories[article.mainCategory].push(article.subCategory)
  })
  return subCategories
}

