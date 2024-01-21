import React, {useEffect, useState} from 'react'
import { MdKeyboardArrowDown } from "react-icons/md";
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { useAuth } from '@/src/contexts/AuthContext';
import { AuthProvider } from '@/src/contexts/AuthContext';
import Link from 'next/link';

const ManagerSideBar = () => {

  // const {user, userInfo} = useAuth();

  const titles = [
    'Title 1', 'Title 2', 'Title 3', 'Title 4', 'Title 5', 'Title 6'
  ]

  const [opened, setOpened] = useState(true)
  const togleOpened = () =>{
    setOpened(!opened)
  }
  const [isHoveringIndex, setIsHoveredIndex] = useState<number | null>(null);
  const onMouseEnter = (index:  number) => setIsHoveredIndex(index);
  const onMouseLeave = () => setIsHoveredIndex(null);

  const number = titles.length
  const [count, setCount] = useState(number)

  useEffect(() => {
    setCount(number)
  }, titles)


  
  return (

      <section className='h-full w-96 border-2 rounded-lg p-1 bg-white'>
            <div className='w-hull h-full'>
                <div style={{marginBottom: '16px'}} className='flex text-black justify-between items-center w-full bg-blue-200 h-12 rounded-lg px-2 cursor-pointer' onClick={togleOpened}>
                    <p className='font-bold'>Mes Compositions</p>
                    <div className='flex items-center justify-between'>
                        {count}
                        <span>
                        {opened ? <BsChevronDown size={20} /> : <BsChevronUp size={20} />}
                      </span>
                    </div>            
                </div>

                <div style={{display: 'flex', flexDirection: 'column'}}>

                  {
                      titles.map((item, index) => (
                        <div key={index} onMouseEnter={() =>  onMouseEnter(index)} onMouseLeave={onMouseLeave}>
                          <Link href="/" style={{display: opened? 'block' : 'none', backgroundColor: isHoveringIndex === index? '#D3D3D3' : 'white' }}  className='cursor-pointer rounded-md border-b border-solid px-2 py-3 text-black'>
                            {item}
                          </Link>
                        </div>
                      ))
                    }

                </div>
              
                  
                    
                

              </div>

      </section>

  )
}

export default ManagerSideBar