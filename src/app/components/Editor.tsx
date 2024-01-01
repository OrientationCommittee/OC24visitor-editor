"use client";

import { ComponentProps } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import "ress";

import { nodes } from "../nodes";
import { theme } from "../theme";

import { AutoFocusPlugin } from "../plugins/AutoFocusPlugin";
import { ToolbarPlugin } from "../plugins/ToolbarPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { InlineToolbarPlugin } from "../plugins/InlineToolbarPlugin";
import { ListMaxIndentLevelPlugin } from "../plugins/ListMaxIndentLevelPlugin";
import { MarkdownPlugin } from "../plugins/MarkdownPlugin";
import { LinkPlugin } from "../plugins/LinkPlugin";
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

      <div className="relative p-4 my-0 mx-4 border border-slate-400 min-h-[480px]">
        <RichTextPlugin
          contentEditable={<ContentEditable className="outline-none" />}
          placeholder={
            <div className="absolute text-gray-500 pointer-events-none select-none top-4 left-4">
              記事を作成
            </div>
          }
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
  );
}