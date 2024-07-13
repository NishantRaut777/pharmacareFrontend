import React from 'react'
import Header from '../../components/Header'
import Products from '../../components/Products'
import Footer from '../../components/Footer'
import Carousel from '../../components/Carousel'
import { useState } from 'react'

const HomePage = () => {
  
  return (
    <div>
      <Header />
      <Carousel />
      <Products />
      <Footer />
    </div>
  )
}

export default HomePage
