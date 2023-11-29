import React from 'react'
import { useState } from "react"
import styles from '../../styles/SearchTableEntry.module.css'

function SearchTableEntry(props : {documentName : string, notionsList : {content : string}[]}) {
    const [documentName, setDocumentName] = useState(props.documentName)
    const [notionsList, setNotionsList] = useState(props.notionsList)
  return (
    <div className={styles.notioncardContainer}>
        <div className='p-[4px]'>
            <span>Co</span>
            <span>{documentName}</span>
        </div>
        {
            notionsList.map((notion : {content : string}, index : number) =>{
                return (
                    <button key={index}>
                        <div>
                            <span style={{color:'#4285F4', fontWeight:'bold'}}>Notion</span>
                        </div>
                        <span>{notion.content}</span>
                    </button>
                )
            })
        }
        

    </div>
  )
}

export default SearchTableEntry
