"use client";

import { ComponentProps } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import styles from "./Editor.module.scss";

import { nodes } from "./nodes";
import { theme } from "./theme";

import { AutoFocusPlugin } from "./plugins/AutoFocusPlugin";
import { ToolbarPlugin } from "./plugins/ToolbarPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { InlineToolbarPlugin } from "./plugins/InlineToolbarPlugin";
import { ListMaxIndentLevelPlugin } from "./plugins/ListMaxIndentLevelPlugin";
import { MarkdownPlugin } from "./plugins/MarkdownPlugin";
import { LinkPlugin } from "./plugins/LinkPlugin";
import LexicalClickableLinkPlugin from "@lexical/react/LexicalClickableLinkPlugin";

const initialConfig: ComponentProps<typeof LexicalComposer>["initialConfig"] = {
  namespace: "MyEditor",
  nodes: nodes,
  theme: theme,
  onError: (error) => console.error(error),
};

export function Editor() {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <InlineToolbarPlugin />

      <div className={styles.editorContainer}>
        <RichTextPlugin
          contentEditable={<ContentEditable className={styles.contentEditable} />}
          placeholder={<div className={styles.placeholder}>いまなにしてる？</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>

      <AutoFocusPlugin />
      <HistoryPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <TabIndentationPlugin />
      <ListMaxIndentLevelPlugin maxDepth={5} />
      <MarkdownPlugin />
      <LinkPlugin />
      <LexicalClickableLinkPlugin />
    </LexicalComposer>
  )
}

