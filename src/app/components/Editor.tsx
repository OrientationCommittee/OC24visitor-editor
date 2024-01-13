"use client";

import { FC, ComponentProps, useState, useEffect, useRef } from "react";
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
import { HTMLToolbarPlugin } from "../plugins/HtmlToolbarPlugin";
import { ToastProvider } from "../plugins/useToast";

import type { ArticleType } from "../types";
import styles from "./Editor.module.scss";

const initialConfig: ComponentProps<typeof LexicalComposer>["initialConfig"] = {
  namespace: "MyEditor",
  nodes: nodes,
  theme: theme,
  onError: (error) => console.error(error),
};

export const Editor: FC<{ initialData?: ArticleType; edit: boolean }> = (props) => {
  const initialData: ArticleType = {
    _id: props?.initialData?._id ?? undefined,
    title: props?.initialData?.title ?? "",
    mainCategory: props?.initialData?.mainCategory ?? "fresher",
    subCategory: props?.initialData?.subCategory ?? "",
    date: "0000/00/00",
    content: props?.initialData?.content ?? "",
    shown: props?.initialData?.shown ?? false,
  };

  const articleRef = useRef<ArticleType>(initialData);

  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      });
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <button type="button" className="flex items-center bg-gray-200 h-[48px] p-3">
          <svg
            className="animate-slowspin fill-none stroke-sky-500 stroke-[10px]"
            width="32"
            height="32"
            strokeDasharray="14"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="40" />
          </svg>
          <span className="text-center items-middle px-4 text-xl font-medium">Loading...</span>
        </button>
      </div>
    );
  } else {
    return (
      <ToastProvider>
        <LexicalComposer initialConfig={initialConfig}>
          <div className="flex justify-between items-start">
            <div>
              <ToolbarPlugin />
              <InlineToolbarPlugin />
            </div>
            <HTMLToolbarPlugin articleRef={articleRef} edit={props?.edit} />
          </div>

          <div
            id="content"
            className="relative p-4 my-0 mx-0 border rounded-lg border-slate-400 min-h-[480px]"
          >
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
      </ToastProvider>
    );
  }
};
