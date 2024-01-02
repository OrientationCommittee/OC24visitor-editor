export const categories: { [key: string]: string } = {
  newcomer: "新入生の方へ",
  oriter: "オリターの方へ",
  circle: "サークルの方へ",
  committee: "当委員会について",
};
export type ArticleType = {
  title: string; // 記事タイトル (pathにもなる)
  category: (typeof categories)[number]; // 大枠のカテゴリ
  subCategory: string; // 各ページ内で見出しでまとめる用
  date: string; // 更新日
  article: string; // html形式
  shown: boolean; // 公開するかどうか
}