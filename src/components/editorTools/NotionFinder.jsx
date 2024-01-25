import { CiSearch }  from 'react-icons/ci'
import React, { useState } from 'react'
import NotionSearchCard from './NotionSearchCard/NotionSearchCard'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const NotionFinder = ({addNodeTitle, richTextValue, documentTitle}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const [notionFinderObject, setNotionFinderObject] = useState([]);

    const newNotion = {
      documentName: documentTitle,
      notionsList: [
        {
          content: richTextValue,
          notionName: addNodeTitle
        }
      ]
    };
  

    const updatedNotionFinderObject = [...notionFinderObject, newNotion];
    
    
    

    const filteredNotionFinderObject = updatedNotionFinderObject.filter((item) => {
        const filteredNotionsList = item.notionsList.filter((notion) =>
          notion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notion.notionName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    
        return filteredNotionsList.length > 0;
      });
    return (
        <section className='w-[600px] h-full border-2 rounded-lg p-2 flex flex-col justify-between overflow-hidden notion-finder-width'>
            <div className='h-12 w-full border bg-gray-300 rounded-lg flex items-center pr-2'>
                <div className='h-10 w-10 flex items-center justify-center'><CiSearch size={24}/></div>
                <input type='text' className='bg-transparent h-10 w-full outline-none' value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} placeholder='Rechercher...'/>
            </div>

            <div className='bg-gray-100 w-full h-full m-auto mt-8 p-2 overflow-auto gap-2 flex flex-col' style={{borderRadius:8}}>
                {
                    filteredNotionFinderObject.map((findObject, index) => {
                        return(
                            <NotionSearchCard
                                key={index}
                                documentJSON={findObject}
                                addNodeTitle = {addNodeTitle}
                              
                            />
                        )
                    })
                }
                
            </div>
        </section>
    )
}

export default NotionFinder