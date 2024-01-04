export const categories_jp = {
  fresher: "新入生の方へ",
  oriter: "オリターの方へ",
  circle: "サークルの方へ",
  committee: "当委員会について",
} as const;

export type MainCategoryType = keyof typeof categories_jp;

export type ArticleType = {
  _id?: string; //dbの_id
  title: string; // 記事タイトル (pathにもなる)
  date: string; // 更新日
  mainCategory: MainCategoryType; // 大枠のカテゴリ
  subCategory: string; // 各ページ内で見出しでまとめる用
  content: string; // html形式
  shown: boolean; // 公開するかどうか
  _v?: number;
}