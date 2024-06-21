import React, {useState} from 'react'
import styles from './NotionSearchCard.module.css'
/* import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
 */
function NotionSearchCard(props) {
    
   
  return (
    <div className={styles.notioncardContainer}>
        <div className='p-[6px]'>
            <span>Co</span>
            <span>{props.documentName}</span>
            <span></span>
        </div>
       
        {
            props.notionsItem.map((item, index) =>{
                console.log(props.addNodeTitle, 'hmm')
                return (
                    
                    <button key={index}>
                        <div>
                            <span style={{color:'#4285F4', fontWeight:'bold'}}>{item.notionName}</span>
                        </div>
                        {/* <div dangerouslySetInnerHTML={{ __html: notion.content }}></div> */}
                    </button>
                  
                )
            })
        }
        

    </div>
  )
}

export default NotionSearchCard