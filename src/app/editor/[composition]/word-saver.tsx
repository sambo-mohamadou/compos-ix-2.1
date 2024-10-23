'use server';
import fs from 'fs';
import path from 'path';
import { saveAs } from 'file-saver';
import HTMLtoDOCX from 'html-to-docx';

// lib/generateDocx.js

export async function generateDocx(renderingHtml, richTextValue) {
  const htmlString = `<div>${renderingHtml}</div><div>${richTextValue}</div>`;
  const filePath = '/Users/cynthiaabi/Desktop/example.docx';

  const fileBuffer = await HTMLtoDOCX(htmlString, null, {
    table: { row: { cantSplit: true } },
    footer: true,
    pageNumber: true,
  });

  fs.writeFile(filePath, fileBuffer, (error) => {
    if (error) {
      console.error('Error during conversion:', error);
      return;
    }
    console.log('vmncnsm');
  });
}
