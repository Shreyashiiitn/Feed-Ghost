'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react'; // this will give use useSession and signout 
import { Button } from './ui/button';
import { User } from 'next-auth';


// user to milega ji , user ke andar , session and token hai , 
// to sara data user ke session se lena hoga 
// usesession works on client side , it does not work on the server side 
// data is taken from thee session , 

function Navbar() {
  const { data: session } = useSession();
  const user : User = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Feed_Ghost
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user?.username || user?.email}
            </span>
            <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;