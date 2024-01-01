import { FC } from "react";
import { Transformer, HEADING } from "@lexical/markdown";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";

const TRANSFORMERS: Array<Transformer> = [HEADING];

export const MarkdownPlugin: FC = () => {
  return <MarkdownShortcutPlugin transformers={TRANSFORMERS} />;
};