import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = () => {
  return (
    <div><ReactQuill theme='snow' /> </div>
  )
}

export default RichTextEditor;