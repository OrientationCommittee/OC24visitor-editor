"use client";

import { FC, MutableRefObject, useEffect } from "react";
import {
  $getRoot,
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
  LexicalCommand,
  createCommand,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $generateNodesFromDOM } from "@lexical/html";

import styles from "./CommonToolbar.module.scss";

import getCurrentDate from "../utils/getCurrentDate";

import { categories_jp, MainCategoryType, ArticleType } from "../types";
import { getTitles, updateArticle, postArticle, deleteArticle } from "../utils/article";

import { useToast } from "./useToast";

const articleValidator: (
  article: ArticleType,
  ...rest: { cond: boolean; error_message: string }[]
) => { ok: boolean; message?: string[] } = (article, ...rest) => {
  //弾く条件と弾く際のメッセージ
  const conditions = [
    { cond: article.title === "", error_message: "titleの値が不正です" },
    { cond: article.subCategory === "", error_message: "subCategoryの値が不正です" },
  ];
  const messages = [...conditions, ...rest]
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
  const EXPORT_COMMAND: LexicalCommand<Function> = createCommand();
  const IMPORT_COMMAND: LexicalCommand<string> = createCommand();
  const [editor] = useLexicalComposerContext();

  const { articleRef, edit } = props;
  // articleの初期値をinitialDataとして取っておく
  const initialData = JSON.parse(JSON.stringify(articleRef.current));

  const id = articleRef.current._id;

  const showToast = useToast();

  const saveArticle = (article: ArticleType, options: { type: "new" | "edit" | "delete" }) => {
    const { type } = options;
    getTitles()
      .then((titles) => {
        return titles.filter((e) => e._id !== id).map((e) => e.title);
      })
      .then((disallowedTitles) => {
        const v = articleValidator(article, {
          cond: disallowedTitles.includes(article.title),
          error_message: `title「${article.title}」の記事が既に存在しています`,
        });
        switch (type) {
          case "new":
            if (!v.ok) {
              showToast({ text: v.message![0], type: "error" });
              return;
            }
            postArticle(article)
              .then((response) => {
                if (response.status === 200) {
                  location.href = "/";
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
            if (!article._id) {
              showToast({ text: "記事データにidが存在しません", type: "error" });
              return;
            }
            if (!v.ok) {
              showToast({ text: v.message![0], type: "error" });
              return;
            }
            updateArticle(article._id, article)
              .then((response) => {
                if (response.status === 200) {
                  showToast({ text: "送信に成功しました", type: "success" });
                  if (article.title !== initialData.title) {
                    location.href = `/24/editor/${article.title}/edit`;
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
            if (!article._id) {
              showToast({ text: "記事データにidが存在しません", type: "error" });
              return;
            }
            if (!confirm("記事を削除します。本当によろしいですか？")) return;
            deleteArticle(article._id)
              .then((response) => {
                if (response.status === 200) {
                  location.href = "/";
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
  };

  // exportコマンド。ArticleTypeでエクスポートする。
  editor.registerCommand(
    EXPORT_COMMAND,
    (
      getArguments: () => { exporter: (article: ArticleType, options: any) => void; options: any }
    ) => {
      const { exporter, options } = getArguments();

      const contentAsHTML = $generateHtmlFromNodes(editor);
      const curDate = getCurrentDate();
      articleRef.current.content = contentAsHTML;
      articleRef.current.date = curDate;

      if (exporter) {
        exporter(articleRef.current, options);
      }
      return true;
    },
    COMMAND_PRIORITY_EDITOR
  );

  // importコマンド。ArticleTypeにおけるcontentのみ、インポートする。
  // 直接は触らない
  editor.registerCommand(
    IMPORT_COMMAND,
    (defaultContentAsHTML: string) => {
      const Import = (editor: any, defaultContentAsHTML?: string) => {
        if (defaultContentAsHTML) {
          const parser = new DOMParser();
          const textHtmlMimeType: DOMParserSupportedType = "text/html";
          const dom = parser.parseFromString(defaultContentAsHTML, textHtmlMimeType);
          const nodes = $generateNodesFromDOM(editor, dom);
          $getRoot().clear();
          $insertNodes(nodes);
        }
        return null;
      };
      Import(editor, defaultContentAsHTML);
      return true;
    },
    COMMAND_PRIORITY_EDITOR
  );

  // 最初に記事の内容を読み込む
  // ほかのカテゴリとかはdefaultValueとして下で読み込んでる
  useEffect(() => {
    editor.dispatchCommand(IMPORT_COMMAND, articleRef.current.content);
  });

  return (
    <div className={styles.toolbar}>
      <div className="flex items-center justify-start mb-4">
        <div className="mr-4">カテゴリ</div>

        {/* カテゴリ欄 */}
        <div className="flex items-center justify-start mr-[20px]">
          <div className="ml-0 pl-[8px] text-gray border-gray-300 border rounded-l-[6px] after:content-['▼'] after:text-gray-500 after:absolute after:-translate-x-4 after:scale-y-75 after:pointer-events-none">
            <select
              className="w-[165px]"
              defaultValue={articleRef.current.mainCategory}
              onChange={(e) => {
                articleRef.current.mainCategory = e.target.value as MainCategoryType;
              }}
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
              defaultValue={articleRef.current.subCategory}
              onChange={(e) => {
                articleRef.current.subCategory = e.target.value;
              }}
            />
          </div>
        </div>

        {/* 公開トグルボタン */}
        <div className="flex items-center justify-start mr-[20px]">
          <div className="mr-[8px]">公開</div>
          <label>
            <input
              type="checkbox"
              defaultChecked={articleRef.current.shown}
              className="peer sr-only"
              onChange={(e) => {
                articleRef.current.shown = e.target.checked;
              }}
            />
            <span className="block w-[2em] cursor-pointer bg-gray-500 rounded-full p-[1px] after:block after:h-[1em] after:w-[1em] after:rounded-full after:bg-white after:transition peer-checked:bg-green-500 peer-checked:after:translate-x-[calc(100%-2px)]"></span>
          </label>
        </div>
      </div>
      <div className="flex items-center flex-wrap">
        <div className="mr-4">タイトル</div>

        {/* タイトル欄 */}
        <div className="py-0 px-[8px] text-gray border-gray-300 border rounded-[6px] min-w-[300px] mr-[20px]">
          <input
            className="w-full"
            placeholder="タイトルを入力"
            defaultValue={articleRef.current.title}
            onChange={(e) => {
              articleRef.current.title = e.target.value;
            }}
          />
        </div>
        {/* エクスポート・インポートボタン */}
        <div>
          <button
            type="button"
            title="export"
            className="bg-green-600 text-white text-xs py-2 px-6 rounded text-center"
            onClick={() => {
              editor.dispatchCommand(EXPORT_COMMAND, () => {
                return { exporter: saveArticle, options: { type: edit ? "edit" : "new" } };
              });
            }}
          >
            更新
          </button>
        </div>
        {edit ? (
          <>
            <button
              type="button"
              className="bg-red-500 text-white text-xs py-2 px-6 rounded text-center ml-2"
              onClick={() => {
                editor.dispatchCommand(EXPORT_COMMAND, () => {
                  return { exporter: saveArticle, options: { type: "delete" } };
                });
              }}
            >
              削除
            </button>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
