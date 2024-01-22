"use client";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";

import ListMaxIndentLevelPlugin from "./ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./CodeHighlightPlugin";
import AutoLinkPlugin from "./AutoLinkPlugin";
import theme from "./EditorThemes";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function Placeholder() {
  return (
    <div className=" text-gray-600 dark:text-gray-100 overflow-hidden absolute text-ellipsis top-4 left-3 text-sm inline-block pointer-events-none">
      Enter some rich text...
    </div>
  );
}

const editorConfig = {
  namespace: "Editor",
  theme,
  onError(error: any) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

export default function Editor() {
  const [editorState, setEditorState] = useState<string>();
  const [, saveEditorState] = useLocalStorage("text", "");

  function onChange(editorState: any, editor: any, selection: any) {
    const editorStateJSON = editorState.toJSON();
    // console.log("Editor state changed!", JSON.stringify(editorStateJSON));
    // However, we still have a JavaScript object, so we need to convert it to an actual string with JSON.stringify
    setEditorState(JSON.stringify(editorStateJSON));
  }

  function MyCustomAutoFocusPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
      return editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const htmlString = $generateHtmlFromNodes(editor, null);
          console.log(htmlString);
        });
      });
    }, [editor]);

    return null;
  }

  function onSave() {
    saveEditorState(editorState || "");
  }

  return (
    <>
      <LexicalComposer initialConfig={editorConfig}>
        <div
          className="my-5 mx-auto rounded-sm max-w-4xl text-black dark:text-white relative leading-5 font-normal
       text-left rounded-tl-sm rounded-tr-sm"
        >
          <ToolbarPlugin />
          <div className="relative dark:bg-gray-700">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="min-h-[200px] resize-none text-sm caret-slate-200 relative space-x-1 outline-0 py-4 px-2" />
              }
              placeholder={<Placeholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <LinkPlugin />
            <AutoLinkPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <OnChangePlugin onChange={onChange} />
            <MyCustomAutoFocusPlugin />
          </div>
        </div>
      </LexicalComposer>
      <button
        onClick={onSave}
        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        Save
      </button>
    </>
  );
}
