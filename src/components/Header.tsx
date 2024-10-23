'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const {user, userLoggedIn}  = useAuth();
  const [initials, setInitials] = useState<String>('C');
  const gettingInitials = () => {
    if (userLoggedIn && user?.email) {
      const firstLetter = user.email.charAt(0).toUpperCase();
      setInitials(firstLetter);
    } else {
      setInitials('C');
    }
  };
  useEffect(() => {
    gettingInitials();
  }, [userLoggedIn])
  
  return (
    <div className="w-full sticky top-0 z-50 flex items-center justify-between px-4 py-2 bg-white h-24 shadow-md">
      <div className="flex justify-start items-center">
        <h1 className="font-extrabold text-3xl px-6">
          <Link href="/">XCCM</Link>
        </h1>
        <div className="relative h-full flex items-center justify-start px-4">
          <div className="w-1 h-12 bg-gradient-to-b from-amber-900 via-amber-700 to-amber-500"></div>
          <p className="text-2xl ml-4">Module de Compositon de Contenus</p>
        </div>
      </div>
      <div style={{
        height: '2.25rem',
        boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.05)',
        width: '2.25rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        lineHeight: '50px',
        backgroundColor: '#5f1694'
      }}>
        {initials}
      </div>
    </div>
  );
};

export default Header;

{
  /* <Image
src='/images/LOGO-POLYTECHNIQUE-01-scaled.jpg'
height={126}
width={126}
alt='office scheme'
/> */
}
