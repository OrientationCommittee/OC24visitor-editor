import { FC, useState, useEffect } from "react";
import { FORMAT_TEXT_COMMAND, $getSelection, $isRangeSelection } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  MdFormatBold,
  MdFormatUnderlined,
  MdFormatStrikethrough,
  MdFormatItalic,
} from "node_modules/react-icons/md";

import styles from "./CommonToolbar.module.scss";

export const InlineToolbarPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        setIsBold(selection.hasFormat("bold"));
        setIsUnderline(selection.hasFormat("underline"));
        setIsStrikethrough(selection.hasFormat("strikethrough"));
        setIsItalic(selection.hasFormat("italic"));
      });
    });
  }, [editor]);

  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        title="bold"
        aria-label="format bold"
        role="checkbox"
        aria-checked={isBold}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        <MdFormatBold size={24} />
      </button>
      <button
        type="button"
        title="underline"
        aria-label="format underline"
        role="checkbox"
        aria-checked={isUnderline}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        <MdFormatUnderlined size={24} />
      </button>
      <button
        type="button"
        title="strikethrough"
        aria-label="format strikethrough"
        role="checkbox"
        aria-checked={isStrikethrough}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}
      >
        <MdFormatStrikethrough size={24} />
      </button>
      <button
        type="button"
        title="italic"
        aria-label="format italic"
        role="checkbox"
        aria-checked={isItalic}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        <MdFormatItalic size={24} />
      </button>
    </div>
  );
};
