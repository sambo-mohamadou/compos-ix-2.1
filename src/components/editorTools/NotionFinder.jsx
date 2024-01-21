import { CiSearch } from 'react-icons/ci'
import React from 'react'
import NotionSearchCard from './NotionSearchCard/NotionSearchCard'

const NotionFinder = () => {
    const notionFinderObject = [
        {
            documentName: "Modele de Support 1",
            notionsList: [
                {
                    content: "Contenu de Notion 1"
                },
                {
                    content: "Contenu de Notion 2"
                },
                {
                    content: "Contenu de Notion 3"
                }
            ]
        },
        {
            documentName: "Modele de Support 2",
            notionsList: [
                {
                    content: "Contenu de Notion"
                }
            ]
        },
        {
            documentName: "Modele de Support 3",
            notionsList: [
                {
                    content: "Contenu de Notion 1"
                },
                {
                    content: "Contenu de Notion 2"
                }
            ]
        },
        {
            documentName: "Modele de Support 4",
            notionsList: [
                {
                    content: "Contenu de Notion 3"
                },
                {
                    content: "Contenu de Notion 4"
                },
                {
                    content: "Contenu de Notion 7"
                }
            ]
        }
    ]
    return (
        <section className='w-[600px] h-full border-2 rounded-lg p-2 flex flex-col justify-between overflow-hidden notion-finder-width'>
            <div className='h-12 w-full border bg-gray-300 rounded-lg flex items-center pr-2'>
                <div className='h-10 w-10 flex items-center justify-center'><CiSearch size={24}/></div>
                <input type='text' className='bg-transparent h-10 w-full outline-none' placeholder='Rechercher...'/>
            </div>

            <div className='bg-gray-100 w-full h-full m-auto mt-8 p-2 overflow-auto gap-2 flex flex-col' style={{borderRadius:8}}>
                {
                    notionFinderObject.map((findObject, index) => {
                        return(
                            <NotionSearchCard
                                key={index}
                                documentJSON={findObject}
                            />
                        )
                    })
                }
                
            </div>
        </section>
    )
}

export default NotionFinder