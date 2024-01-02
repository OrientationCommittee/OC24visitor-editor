import { FC, useEffect } from 'react';
import { $getRoot, $insertNodes, COMMAND_PRIORITY_EDITOR, LexicalCommand, createCommand } from "lexical";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes } from '@lexical/html';
import { $generateNodesFromDOM } from '@lexical/html';

import { CiExport, CiImport } from "react-icons/ci";
import styles from "./CommonToolbar.module.scss"

import getCurrentDate from "../utils/getCurrentDate";

import { categories, ArticleType } from "../types";

//HTMLToolbarPlugin
export const HTMLToolbarPlugin: FC<{articleState: ArticleType, updateArticleState: (key: keyof ArticleType, value: any) => void}> = (props) => {
  const EXPORT_COMMAND : LexicalCommand<Function> = createCommand();
  const IMPORT_COMMAND: LexicalCommand<string> = createCommand();
  const [ editor ] = useLexicalComposerContext();

  //articleStateで状態を常に追っているように書いているが、全然そんなことない。たぶんselectで入力させてる２つだけ。
  //誰か書き直してくれませんか...？
  const articleState = props.articleState;
  const updateArticleState = props.updateArticleState;

  //useStateでやると再レンダリングでバグる、もうわけわからん。
  let subCategory = articleState.subCategory;
  let title = articleState.title;

  //exportコマンド。ArticleTypeでエクスポートする。
  editor.registerCommand(
    EXPORT_COMMAND,
    (exporter: Function) => {
      const Export = (editor: any, exporter?: Function) => {
        const contentAsHTML = $generateHtmlFromNodes(editor);
        const curDate = getCurrentDate();
        const article = {...articleState, subCategory: subCategory,article: contentAsHTML, date: curDate, title: title};
        if (exporter) {
          exporter(article);
        }
        return null;
      };
      Export(editor,  exporter);
      return true
    },
    COMMAND_PRIORITY_EDITOR
  )

  //importコマンド。ArticleTypeにおけるarticleのみ、インポートする。
  editor.registerCommand(
    IMPORT_COMMAND,
    (defaultContentAsHTML: string) => {
      const Import = (editor: any, defaultContentAsHTML?: string) => {
        if (defaultContentAsHTML) {
          const parser = new DOMParser();
          const textHtmlMimeType: DOMParserSupportedType = 'text/html';
          const dom = parser.parseFromString(defaultContentAsHTML, textHtmlMimeType);
          const nodes = $generateNodesFromDOM(editor, dom);
          $getRoot().clear();
          $insertNodes(nodes);
        }
        return null;
      };
      Import(editor, defaultContentAsHTML);
      return true
    },
    COMMAND_PRIORITY_EDITOR
  )

  useEffect(() => {
    editor.dispatchCommand(IMPORT_COMMAND, articleState.article);
  })

  return (
    <div className={styles.toolbar}>
      <div className={styles.upper}>
        <select className={styles.selectCategory} value={articleState.mainCategory} onChange={e => {
          updateArticleState("mainCategory", e.target.value);
        }}>
          {...Object.keys(categories).map(key => { return <option key={key} value={key}>{categories[key]}</option>})}
        </select>
        <select className={styles.selectShownOrHidden} value={articleState.shown ? "shown" : "hidden"} onChange={e => {
          updateArticleState("shown", Boolean(e.target.value == "shown"));
        }}>
          <option value="shown">公開</option>
          <option value="hidden">非公開</option>
        </select>
        <div>
        <button
          type="button"
          title="export"
          onClick={() => {
            const exporter = console.log; //ここにexport用の関数（引数：ArticleTypeオブジェクト）を記述
            editor.dispatchCommand(EXPORT_COMMAND, exporter);
          }}
        >
          <CiExport size={24} />
        </button>
        <button
          type="button"
          title="import"
          onClick={() => {
            const defaultContentAsHTML = '<h1 class="theme_h1__OZrJ5" dir="ltr"><span style="white-space: pre-wrap;">にゃあ</span></h1><p class="theme_paragraph__0NEJb" dir="ltr"><span style="white-space: pre-wrap;">にゃんにゃん</span></p>'; //ここに挿入したいhtmlを記述
            editor.dispatchCommand(IMPORT_COMMAND, defaultContentAsHTML);
          }}
        >
          <CiImport size={24} />
        </button>
        </div>
      </div>
      <div className={styles.lower}>
        <div>
          <input className={styles.sub} placeholder="サブカテゴリを入力" defaultValue={articleState.subCategory} onChange={e => {
            subCategory = e.target.value;
          }}/>
        </div>
        <div>
          <input className={styles.title} placeholder="タイトルを入力" defaultValue={articleState.title} onChange={e => {
            title = e.target.value;
          }}/>
        </div>
      </div>
    </div>
  )
}