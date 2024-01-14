"use client";

import { FC, MutableRefObject, useEffect } from "react";
import { useRouter } from "next/navigation";
import { $getRoot, $insertNodes } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";

import styles from "./CommonToolbar.module.scss";

import { categories_jp, MainCategoryType, ArticleType } from "../types";
import { getCurrentDate } from "../utils/getCurrentDate";
import { getTitles, updateArticle, postArticle, deleteArticle } from "../utils/article";

import { useToast } from "./useToast";

const articleValidator: (
  articleData: ArticleType,
  ...rest: { cond: boolean; error_message: string }[]
) => { ok: boolean; message?: string[] } = (articleData, ...rest) => {
  const error_conditions = [
    { cond: articleData.content === "", error_message: "contentの値が不正です" },
    { cond: articleData.subCategory === "", error_message: "subCategoryの値が不正です" },
    { cond: articleData.title === "", error_message: "titleの値が不正です" },
  ];
  const messages = [...error_conditions, ...rest]
    .filter((e) => e.cond)
    .map((e) => e.error_message)
    .filter((e) => e);
  return messages.length
    ? {
        ok: false,
        message: messages,
      }
    : { ok: true }; // エラーメッセージが無い
};

// HTMLToolbarPlugin
export const HTMLToolbarPlugin: FC<{
  articleRef: MutableRefObject<ArticleType>;
  edit: boolean;
}> = (props) => {
  const { articleRef, edit } = props;
  const curArticle = articleRef.current;
  const initialData = JSON.parse(JSON.stringify(curArticle)); //初期値を取っておく

  const [editor] = useLexicalComposerContext();
  const router = useRouter();
  const showToast = useToast();

  const sendArticle = (options: { type: "new" | "edit" | "delete" }) => {
    const editorState = editor.getEditorState();
    editorState.read(() => {
      curArticle.content = $generateHtmlFromNodes(editor); //contentAsHTML
      curArticle.date = getCurrentDate();

      getTitles()
        .then((titles) => {
          return titles.filter((e) => e._id !== initialData._id).map((e) => e.title);
        })
        .then((disallowedTitles) => {
          const v = articleValidator(curArticle, {
            cond: disallowedTitles.includes(curArticle.title),
            error_message: `title「${curArticle.title}」の記事が既に存在しています`,
          });
          switch (options.type) {
            case "new":
              if (!v.ok) {
                showToast({ text: v.message![0], type: "error" });
                return;
              }
              postArticle(curArticle)
                .then((response) => {
                  if (response.status === 200) {
                    router.push("/");
                  } else {
                    console.log(response);
                    showToast({ text: "送信に失敗しました", type: "error" });
                  }
                })
                .catch((e) => {
                  console.log(e);
                  showToast({ text: e, type: "error" });
                });
              break;
            case "edit":
              if (!curArticle._id) {
                showToast({ text: "記事データにidが存在しません", type: "error" });
                return;
              }
              if (!v.ok) {
                showToast({ text: v.message![0], type: "error" });
                return;
              }
              updateArticle(curArticle._id, curArticle)
                .then((response) => {
                  if (response.status === 200) {
                    showToast({ text: "送信に成功しました", type: "success" });
                    if (curArticle.title !== initialData.title) {
                      router.push(`/${curArticle.title}/edit`);
                    }
                  } else {
                    console.log(response);
                    showToast({ text: "送信に失敗しました", type: "error" });
                  }
                })
                .catch((e) => {
                  console.log(e);
                  showToast({ text: e, type: "error" });
                });
              break;
            case "delete":
              if (!curArticle._id) {
                showToast({ text: "記事データにidが存在しません", type: "error" });
                return;
              }
              if (!confirm("記事を削除します。本当によろしいですか？")) return;
              deleteArticle(curArticle._id)
                .then((response) => {
                  if (response.status === 200) {
                    router.push("/");
                  } else {
                    console.log(response);
                    showToast({ text: "送信に失敗しました", type: "error" });
                  }
                })
                .catch((e) => {
                  console.log(e);
                  showToast({ text: e, type: "error" });
                });
              break;
          }
        });
    });
  };

  const loadContent = (content: string) => {
    editor.update(() => {
      const parser = new DOMParser();
      const textHtmlMimeType: DOMParserSupportedType = "text/html";
      const dom = parser.parseFromString(content, textHtmlMimeType);
      const nodes = $generateNodesFromDOM(editor, dom);
      $getRoot().clear();
      $insertNodes(nodes);
    });
  };
  useEffect(() => loadContent(initialData.content));

  return (
    <div className={styles.toolbar}>
      <div className="flex items-center justify-start mb-4">
        {/* カテゴリ欄 */}
        <div className="mr-4">カテゴリ</div>
        <div className="flex items-center justify-start mr-[20px]">
          <div className="ml-0 pl-[8px] text-gray border-gray-300 border rounded-l-[6px] after:content-['▼'] after:text-gray-500 after:absolute after:-translate-x-4 after:scale-y-75 after:pointer-events-none">
            <select
              className="w-[165px]"
              defaultValue={curArticle.mainCategory}
              onChange={(e) => (curArticle.mainCategory = e.target.value as MainCategoryType)}
            >
              {...(Object.keys(categories_jp) as MainCategoryType[]).map((mainCategory, index) => {
                return (
                  <option key={index} value={mainCategory}>
                    # {categories_jp[mainCategory]}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="ml-[-1px] py-0 px-[8px] text-gray border-gray-300 border rounded-r-[6px]">
            <input
              placeholder="サブカテゴリを入力"
              defaultValue={curArticle.subCategory}
              onChange={(e) => (curArticle.subCategory = e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-start mr-[20px]">
          {/* 公開トグルボタン */}
          <div className="mr-[8px]">公開</div>
          <label>
            <input
              type="checkbox"
              defaultChecked={curArticle.shown}
              className="peer sr-only"
              onChange={(e) => (curArticle.shown = e.target.checked)}
            />
            <span className="block w-[2em] cursor-pointer bg-gray-500 rounded-full p-[1px] after:block after:h-[1em] after:w-[1em] after:rounded-full after:bg-white after:transition peer-checked:bg-green-500 peer-checked:after:translate-x-[calc(100%-2px)]"></span>
          </label>
        </div>
      </div>
      <div className="flex items-center flex-wrap">
        {/* タイトル欄 */}
        <div className="mr-4">タイトル</div>
        <div className="py-0 px-[8px] text-gray border-gray-300 border rounded-[6px] min-w-[300px] mr-[20px]">
          <input
            className="w-full"
            placeholder="タイトルを入力"
            defaultValue={curArticle.title}
            onChange={(e) => (curArticle.title = e.target.value)}
          />
        </div>
        {/* 更新・削除ボタン */}
        <div>
          <button
            type="button"
            title="save"
            className="bg-green-600 text-white text-xs py-2 px-6 rounded text-center"
            onClick={() => sendArticle({ type: edit ? "edit" : "new" })}
          >
            更新
          </button>
        </div>
        {edit && (
          <>
            <button
              type="button"
              title="delete"
              className="bg-red-500 text-white text-xs py-2 px-6 rounded text-center ml-2"
              onClick={() => sendArticle({ type: "delete" })}
            >
              削除
            </button>
          </>
        )}
      </div>
    </div>
  );
};
