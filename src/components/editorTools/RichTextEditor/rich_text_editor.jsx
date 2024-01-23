import React, { useState, useEffect } from "react";
import { ContentState, convertToRaw } from "draft-js";
import { EditorState } from "draft-js";
import Editor from "../../Editor";
import { convertToHTML,  } from "draft-convert";
import { stateFromHTML } from "draft-js-import-html";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function RichTextEditor(props) {
  const [convertedContent, setConvertedContent] = useState(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const loadContentFromHTML = (htmlStringContent) => {
    const contentState = stateFromHTML(htmlStringContent);
    return EditorState.createWithContent(contentState);
  };

  useEffect(() => {
    if (props.defaultText && props.defaultText !== "") {
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromText(props.defaultText)
        )
      );
    } else if (props.defaultHTMLString && props.defaultHTMLString !== "") {
      setEditorState(loadContentFromHTML(props.defaultHTMLString));
    }
  }, [props]);

  useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    if (convertedContent !== html) {
      setConvertedContent(html);
      let jsonRaw = convertToRaw(editorState.getCurrentContent()); // RawDraftContentState JSON
      props.setHtmlContent(html);
      props.setJsonContent(JSON.stringify(jsonRaw));
    }
  }, [props, editorState, convertedContent]);

  return (
    <Editor
      defaultEditorState={editorState}
      onEditorStateChange={setEditorState}
      toolbarClassName="w-full text-black !absolute w-[calc(100%-300px)] border border-amber-500 h-[50px] right-0 -top-0 z-50"
      editorClassName="w-full mt-12 max-h-[calc(100%-64px)] h-[calc(100%-64px)] bg-white shadow-lg !overflow-hidden border border-amber max-w-5xl m-auto text-[calc(10px+2vmin)] px-4"
    />
  );
}

export default RichTextEditor;
