import React from 'react'
import Header from '../Header'
import Footer from '../Footer'

const ClientLayout = ({ children }) => {
  return (
    <>
        <Header />
        {children}
        <Footer />
    </>
  )
}

export default ClientLayout
