import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";

const RichTextEditor = ({ props, chandleEditorContent, editorContent }) => {
  const sanitizedDefaultHtml = DOMPurify.sanitize(editorContent.htmlContent, {
    USE_PROFILES: { html: true },
  });
  const [textValue, setTextValue] = useState(sanitizedDefaultHtml);

  const handleTextChange = (value) => {
    // Sanitize the HTML before setting it as the state
    const sanitizedHtml = DOMPurify.sanitize(value, {
      USE_PROFILES: { html: true },
    });
    console.log(sanitizedHtml);
    setTextValue(sanitizedHtml);
    chandleEditorContent(value);
    //Décommenter la ligne suivante en cas de problème
    // props(sanitizedHtml); // Pass the sanitized HTML to the parent or other components
  };
  const handleChange = (content, delta, source, editor) => {
    setTextValue(content);
    props.setHtmlEditorContent(content);
  };
  const modules = {
    toolbar:{
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
      ]
    }
  }

  return (
    <div>
      <ReactQuill
        value={textValue}
        theme="snow"
        onChange={handleTextChange}
        modules={modules}
      />{" "}
    </div>
  );
};

export default RichTextEditor;
