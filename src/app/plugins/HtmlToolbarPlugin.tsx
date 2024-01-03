import { FC, useEffect, useRef } from "react";
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

import { categories, mainCategory, ArticleType } from "../types";

// HTMLToolbarPlugin
export const HTMLToolbarPlugin: FC<{
  articleState: ArticleType;
  updateArticleState: (key: keyof ArticleType, value: any) => void;
  edit: boolean;
}> = (props) => {
  const EXPORT_COMMAND: LexicalCommand<Function> = createCommand();
  const IMPORT_COMMAND: LexicalCommand<string> = createCommand();
  const [editor] = useLexicalComposerContext();

  const articleState = props.articleState;
  const updateArticleState = props.updateArticleState;
  const edit = props.edit;

  const subCategoryRef = useRef(articleState.subCategory);
  const titleRef = useRef(articleState.title);

  // exportコマンド。ArticleTypeでエクスポートする。
  editor.registerCommand(
    EXPORT_COMMAND,
    (exporter: Function) => {
      const Export = (editor: any, exporter?: Function) => {
        const contentAsHTML = $generateHtmlFromNodes(editor);
        const curDate = getCurrentDate();
        const article = {
          ...articleState,
          subCategory: subCategoryRef.current,
          article: contentAsHTML,
          date: curDate,
          title: titleRef.current,
        };
        if (exporter) {
          exporter(article);
        }
        return null;
      };
      Export(editor, exporter);
      return true;
    },
    COMMAND_PRIORITY_EDITOR
  );

  // importコマンド。ArticleTypeにおけるarticleのみ、インポートする。
  editor.registerCommand(
    IMPORT_COMMAND,
    (defaultContentAsHTML: string) => {
      const Import = (editor: any, defaultContentAsHTML?: string) => {
        if (defaultContentAsHTML) {
          const parser = new DOMParser();
          const textHtmlMimeType: DOMParserSupportedType = "text/html";
          const dom = parser.parseFromString(
            defaultContentAsHTML,
            textHtmlMimeType
          );
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
    editor.dispatchCommand(IMPORT_COMMAND, articleState.article);
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
              {...Object.keys(categories).map((key, index) => {
                return (
                  <option key={index} value={key}>
                    # {categories[key as mainCategory]}
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
              const exporter = console.log; // ここにexport用の関数（引数：ArticleTypeオブジェクト）を記述
              editor.dispatchCommand(EXPORT_COMMAND, exporter);
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
        {edit ?
        <>
          <button
            type="button"
            onClick={() => {
              const _id = articleState._id;
              alert("delete!");
              //ここでutil使って削除
            }}
          >
            <TbTrashX size={24} />
          </button>
        </> : ""}
      </div>
    </div>
  );
};
