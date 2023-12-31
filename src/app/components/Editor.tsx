"use client";

import { FC, ComponentProps, useState, useEffect } from "react";
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

import type { ArticleType } from "../types";

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
  const [articleState, setArticleState] = useState<ArticleType>(initialData);
  const updateArticleState = (key: keyof ArticleType, value: any) =>
    setArticleState((article: Readonly<ArticleType>) => {
      return { ...article, [key]: value };
    });

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
        <h1 className="text-center items-middle">Loading...</h1>
      </div>
    );
  } else {
    return (
      <LexicalComposer initialConfig={initialConfig}>
        <div className="flex justify-between items-start">
          <div>
            <ToolbarPlugin />
            <InlineToolbarPlugin />
          </div>
          <HTMLToolbarPlugin
            articleState={articleState}
            updateArticleState={updateArticleState}
            edit={props?.edit}
            setLoading={setLoading}
          />
        </div>

        <div className="relative p-4 my-0 mx-0 border border-slate-400 min-h-[480px]">
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
};
