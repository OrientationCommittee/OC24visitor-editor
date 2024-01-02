export const categories = {
  fresher: "新入生の方へ",
  oriter: "オリターの方へ",
  circle: "サークルの方へ",
  committee: "当委員会について",
} as const;

export type mainCategory = keyof typeof categories;

export type ArticleType = {
  _id?: string; //dbの_id
  title: string; // 記事タイトル (pathにもなる)
  mainCategory: mainCategory; // 大枠のカテゴリ
  subCategory: string; // 各ページ内で見出しでまとめる用
  date: string; // 更新日
  article: string; // html形式
  shown: boolean; // 公開するかどうか
  _v?: number;
}