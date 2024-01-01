import type { EditorThemeClasses } from "lexical";
import styles from "./theme.module.scss";

export const theme: EditorThemeClasses = {
  paragraph: styles.paragraph,
  heading: {
    h1: styles.h1,
    h2: styles.h2,
    h3: styles.h3,
    h4: styles.h4,
  },
  quote: styles.quote,
  link: styles.link,
  list: {
    ul: styles.ul,
    ulDepth: [
      styles.ul1,
      styles.ul2,
      styles.ul3,
      styles.ul4,
      styles.ul5,
    ],
    ol: styles.ol,
    olDepth: [
      styles.ol1,
      styles.ol2,
      styles.ol3,
      styles.ol4,
      styles.ol5,
    ],
    listitem: styles.listitem,
    nested: {
      listitem: styles.nestedListItem,
    },
    listitemChecked: styles.listitemChecked,
    listitemUnchecked: styles.listitemUnchecked,
  },
  text: {
    bold: styles.textBold,
    code: styles.textCode,
    italic: styles.textItalic,
    strikethrough: styles.textStrikethrough,
    subscript: styles.textSubscript,
    superscript: styles.textSuperscript,
    underline: styles.textUnderline,
    underlineStrikethrough: styles.textUnderlineStrikethrough,
  },
};