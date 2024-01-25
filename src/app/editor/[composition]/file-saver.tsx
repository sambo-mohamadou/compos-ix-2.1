'use server';
import { saveAs } from 'file-saver';
import HTMLtoDOCX from 'html-to-docx';

export async function generateDocx(renderingHtml, richTextValue) {
    const htmlString = `<div>${renderingHtml}</div><div>${richTextValue}</div>`;
    console.log('HTML String:', htmlString);
  
    try {
      const fileBuffer = await HTMLtoDOCX(htmlString, null, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
      });
  
      console.log('File Buffer:', fileBuffer);
  
      saveAs(fileBuffer, 'html-to-docx.docx');
    } catch (error) {
      console.error('Error during conversion:', error);
    }
  }

  