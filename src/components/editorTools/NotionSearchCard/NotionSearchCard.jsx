import React, {useState} from 'react'
import styles from './NotionSearchCard.module.css'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function NotionSearchCard(props) {
    const [documentName, setDocumentName] = useState(props.documentJSON.documentName)
    const [notionsList, setNotionsList] = useState(props.documentJSON.notionsList)

    console.log('Filtered Notions List:', notionsList);
   
  return (
    <div className={styles.notioncardContainer}>
        <div className='p-[6px]'>
            <span>Co</span>
            <span>{documentName}</span>
            <span></span>
        </div>
       
        {
            notionsList.map((notion, index) =>{
                console.log(props.addNodeTitle, 'hmm')
                return (
                    
                    <button key={index}>
                        <div>
                            <span style={{color:'#4285F4', fontWeight:'bold'}}>{props.addNodeTitle}</span>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: notion.content }}></div>
                    </button>
                  
                )
            })
        }
        

    </div>
  )
}

export default NotionSearchCard