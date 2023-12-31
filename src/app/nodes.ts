import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { Klass, LexicalNode } from "lexical";

export const nodes: Klass<LexicalNode>[] = [
  HeadingNode,
  QuoteNode,
  ListItemNode,
  ListNode,
];