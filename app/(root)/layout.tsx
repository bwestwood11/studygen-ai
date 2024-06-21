import Navbar from '@/components/layout/Navbar'
import React from 'react'

const WebsiteLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
        <Navbar />
        {children}
    </>
  )
}

export default WebsiteLayout