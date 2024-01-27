import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";


const RichTextEditor = ({props}) => {
  const [textValue, setTextValue] = useState("");

  const handleTextChange = (value) => {
    // Sanitize the HTML before setting it as the state
    const sanitizedHtml = DOMPurify.sanitize(value, {
      USE_PROFILES: { html: true },
    });
    console.log(sanitizedHtml);
    setTextValue(sanitizedHtml);
    props(sanitizedHtml); // Pass the sanitized HTML to the parent or other components
  };
  const handleChange = (content, delta, source, editor) => {
    setTextValue(content);
    props.setHtmlEditorContent(content);
  };

  return (
    <div>
      <ReactQuill value={textValue} theme="snow" onChange={handleTextChange}/>{" "}
    </div>
  );
};

export default RichTextEditor;