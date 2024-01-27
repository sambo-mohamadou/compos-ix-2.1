import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";


const RichTextEditor = ({props,chandleEditorContent, editorContent}) => {
  
  const sanitizedDefaultHtml = DOMPurify.sanitize(editorContent.htmlContent, {
    USE_PROFILES: { html: true },
  });
  const [textValue, setTextValue] = useState(sanitizedDefaultHtml);

  const handleTextChange = (content) => {
    const sanitizedHtml = DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
    }); 

  
    setTextValue(sanitizedHtml);
    chandleEditorContent(value);
    //Décommenter la ligne suivante en cas de problème
    // props(sanitizedHtml); // Pass the sanitized HTML to the parent or other components
  };

  // useEffect(() => {
  //    setEditorState(id)
  // }, [id]);

  return  (
   
      <div>
        <ReactQuill value={textValue} theme="snow" onChange={handleTextChange}/>{" "}
      </div>

  )
};

export default RichTextEditor;