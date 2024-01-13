// server-side
import { FC } from "react";
import { getArticleByTitle } from "../../utils/article";

export const ArticleDataProvider: FC<{ title: string; Editor: any }> = async (props) => {
  const title = decodeURI(props.title);
  const Editor = props.Editor;
  try {
    const article = await getArticleByTitle(title);
    return (
      <div className="pb-24">
        <Editor initialData={article} edit={true} />
      </div>
    );
  } catch (e) {
    console.log(e);
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <h2>タイトル「{title}」の記事は存在しません。正しいURLか確認してください。</h2>
        <br></br>
        <a href="/" className="underline text-neutral-500">
          トップへ戻る
        </a>
      </div>
    );
  }
};
