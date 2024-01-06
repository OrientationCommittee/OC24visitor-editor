// server-side
import { FC } from "react";
import { getArticleByTitle } from "../../utils/article";

export const ArticleDataProvider: FC<{ title: string; Editor: any }> = async (props) => {
  const title = props.title;
  const Editor = props.Editor;
  const article = await getArticleByTitle(title);
  return (
    <div className="pb-24">
      <Editor initialData={article} edit={true} />
    </div>
  );
};
