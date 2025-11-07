'use client'


import React from 'react'
import HeroSection from './landingComponents/HeroSection'
import FAQSection from './landingComponents/FAQSection'
import ContactUs from './landingComponents/ContactUs'
import LandingSection2 from './landingComponents/LandingSection2'
import LandingSection1 from './landingComponents/LandingSection1'
import AddValue from './landingComponents/AddValue'
import Numbers from './landingComponents/Numbers'

const page = () => {
  return (
    <div className='bg-white'>
      <HeroSection />
      <Numbers />
      <AddValue />
      <LandingSection1 />
      <LandingSection2 />
      <FAQSection />
      <ContactUs />
    </div>
  )
}

export default page