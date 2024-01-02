import { FC } from "react";
import { Transformer, ELEMENT_TRANSFORMERS, TEXT_FORMAT_TRANSFORMERS } from "@lexical/markdown";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";

const TRANSFORMERS: Array<Transformer> = [
  ...ELEMENT_TRANSFORMERS,
  // ...TEXT_FORMAT_TRANSFORMERS
];

export const MarkdownPlugin: FC = () => {
  return <MarkdownShortcutPlugin transformers={TRANSFORMERS} />;
};