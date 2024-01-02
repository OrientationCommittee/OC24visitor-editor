import { FC, useEffect } from 'react';
import { $getRoot, $insertNodes, COMMAND_PRIORITY_EDITOR, LexicalCommand, createCommand } from "lexical";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes } from '@lexical/html';
import { $generateNodesFromDOM } from '@lexical/html';

import { CiExport, CiImport } from "react-icons/ci";
import styles from "./CommonToolbar.module.scss"

import { categories, ArticleType } from "../types";

// Export
export const Export = (editor: any, exporterAsHTML?: Function) => {
  const contentAsHTML = $generateHtmlFromNodes(editor);
  if (exporterAsHTML) {
    exporterAsHTML(contentAsHTML);
  }
  return null;
};

// Import
export const Import = (editor: any, defaultContentAsHTML?: string) => {
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

//HTMLToolbarPlugin
export const HTMLToolbarPlugin: FC<{articleState: ArticleType, initialData?: ArticleType}> = (props) => {
  const EXPORT_COMMAND : LexicalCommand<Function> = createCommand();
  const IMPORT_COMMAND: LexicalCommand<string> = createCommand();
  const [ editor ] = useLexicalComposerContext();

  editor.registerCommand(
    EXPORT_COMMAND,
    (exporterAsHTML: Function) => {
      Export(editor, exporterAsHTML);
      return true
    },
    COMMAND_PRIORITY_EDITOR
  )

  editor.registerCommand(
    IMPORT_COMMAND,
    (defaultContentAsHTML: string) => {
      Import(editor, defaultContentAsHTML);
      return true
    },
    COMMAND_PRIORITY_EDITOR
  )

  useEffect(() => {
    if (props?.initialData?.article) {
      editor.dispatchCommand(IMPORT_COMMAND, props.initialData.article);
    }
  },[props.initialData])

  return (
    <div className={styles.toolbar}>
      <div className={styles.upper}>
        <select className={styles.selectCategory}>
          {...Object.keys(categories).map(key => { return <option key={key} value={key}>{categories[key]}</option>})}
        </select>
        <select className={styles.selectShownOrHidden}>
          <option value="shown">公開</option>
          <option value="hidden">非公開</option>
        </select>
        <div>
        <button
          type="button"
          title="export"
          onClick={() => {
            const exporter = console.log; //ここにexport用の関数を記述
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
          <input className={styles.sub} placeholder="サブカテゴリを入力"/>
        </div>
        <div>
          <input className={styles.title} placeholder="タイトルを入力"/>
        </div>
      </div>
    </div>
  )
}