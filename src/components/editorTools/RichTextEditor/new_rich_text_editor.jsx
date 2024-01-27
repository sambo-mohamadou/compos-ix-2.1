import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";


const RichTextEditor = ({ id, onContentChange}) => {
  const [textValue, setTextValue] = useState("");
  const [editorState, setEditorState] = useState()

  console.log('last try', id)
 

  


  const handleTextChange = (content) => {
    const sanitizedHtml = DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
    }); 

  
    setTextValue(sanitizedHtml);
   
    onContentChange(content); // Pass the sanitized HTML to the parent or other components
  };

  // useEffect(() => {
  //    setEditorState(id)
  // }, [id]);

  return id? (
   
      <div>
        <ReactQuill value={textValue} theme="snow" onChange={handleTextChange}/>{" "}
      </div>

  ): null;
};

export default RichTextEditor;
