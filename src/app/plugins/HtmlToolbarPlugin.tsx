import { FC, useEffect, useRef, useState } from "react";
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

import { CiExport, CiImport } from "react-icons/ci";
import { TbTrashX } from "react-icons/tb";
import styles from "./CommonToolbar.module.scss";

import getCurrentDate from "../utils/getCurrentDate";

import { categories_jp, MainCategoryType, ArticleType } from "../types";
import { updateArticle, postArticle, deleteArticle } from "../utils/article";

// HTMLToolbarPlugin
export const HTMLToolbarPlugin: FC<{
  articleState: ArticleType;
  updateArticleState: (key: keyof ArticleType, value: any) => void;
  edit: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props) => {
  const EXPORT_COMMAND: LexicalCommand<Function> = createCommand();
  const IMPORT_COMMAND: LexicalCommand<string> = createCommand();
  const [editor] = useLexicalComposerContext();

  const { articleState, updateArticleState, edit, setLoading } = props;

  const subCategoryRef = useRef(articleState.subCategory);
  const titleRef = useRef(articleState.title);

  const saveArticle = (article: ArticleType, options: { edit: boolean }) => {
    const { edit } = options;

    if (edit && article._id) {
      try {
        setLoading(true);
        updateArticle(article._id, article);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    } else if (!edit) {
      try {
        setLoading(true);
        postArticle(article);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Error: save処理に失敗しました");
    }
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
      const article: ArticleType = {
        ...articleState,
        subCategory: subCategoryRef.current,
        content: contentAsHTML,
        date: curDate,
        title: titleRef.current,
      };
      if (exporter) {
        exporter(article, options);
      }
      return true;
    },
    COMMAND_PRIORITY_EDITOR
  );

  // importコマンド。ArticleTypeにおけるcontentのみ、インポートする。
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

  useEffect(() => {
    editor.dispatchCommand(IMPORT_COMMAND, articleState.content);
  });

  return (
    <div className={styles.toolbar}>
      <div className="flex items-center justify-start">
        <div className="mr-4">カテゴリ</div>

        {/* カテゴリ欄 */}
        <div className="flex items-center justify-start mr-[20px]">
          <div className="ml-0 pl-[8px] pr-[20px] text-gray border-gray-300 border rounded-l-[6px]">
            <select
              value={articleState.mainCategory}
              onChange={(e) => {
                updateArticleState("mainCategory", e.target.value);
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
              defaultValue={articleState.subCategory}
              onChange={(e) => {
                subCategoryRef.current = e.target.value;
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
              checked={articleState.shown}
              className="peer sr-only"
              onChange={(e) => {
                updateArticleState("shown", e.target.checked);
              }}
            />
            <span className="block w-[2em] cursor-pointer bg-gray-500 rounded-full p-[1px] after:block after:h-[1em] after:w-[1em] after:rounded-full after:bg-white after:transition peer-checked:bg-green-500 peer-checked:after:translate-x-[calc(100%-2px)]"></span>
          </label>
        </div>

        {/* エクスポート・インポートボタン */}
        <div>
          <button
            type="button"
            title="export"
            onClick={() => {
              editor.dispatchCommand(EXPORT_COMMAND, () => {
                return { exporter: saveArticle, options: { edit: edit } };
              });
            }}
          >
            <CiExport size={24} />
          </button>
          <button
            type="button"
            title="import"
            onClick={() => {
              const defaultContentAsHTML =
                '<h1 class="theme_h1__OZrJ5" dir="ltr"><span style="white-space: pre-wrap;">にゃあ</span></h1><p class="theme_paragraph__0NEJb" dir="ltr"><span style="white-space: pre-wrap;">にゃんにゃん</span></p>'; //ここに挿入したいhtmlを記述
              editor.dispatchCommand(IMPORT_COMMAND, defaultContentAsHTML);
            }}
          >
            <CiImport size={24} />
          </button>
        </div>
      </div>
      <div className="flex items-center flex-wrap">
        <div className="mr-4">タイトル</div>

        {/* タイトル欄 */}
        <div className="py-0 px-[8px] text-gray border-gray-300 border rounded-[6px] min-w-[300px] mr-[20px]">
          <input
            placeholder="タイトルを入力"
            defaultValue={articleState.title}
            onChange={(e) => {
              titleRef.current = e.target.value;
            }}
          />
        </div>
        {edit ? (
          <>
            <button
              type="button"
              onClick={() => {
                const id = articleState._id;
                if (!id) {
                  alert("記事idが不正です");
                  return;
                }
                const tf = confirm("記事を削除します。本当によろしいですか？");
                if (tf) {
                  deleteArticle(id)
                    .then(() => {
                      location.href = "/";
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                }
              }}
            >
              <TbTrashX size={24} />
            </button>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
