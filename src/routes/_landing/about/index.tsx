import { createFileRoute } from '@tanstack/react-router'
import { usePageTitle } from "@/hooks/usePageTitle"
import Navbar from "@/components/landing/Navbar"
import AnimatedBackground from "@/components/landing/AnimatedBackground"
import { Footer } from "@/components/landing/sections/Footer"
import CompanyOverviewSection from "@/components/landing/about/CompanyOverview"
import MissionVisionSection from "@/components/landing/about/MissionVision"
import TeamSection from "@/components/landing/about/Team"
import { useEffect } from 'react'

export const Route = createFileRoute('/_landing/about/')({
  component: AboutPage,
})

function AboutPage() {
  usePageTitle("About Us")

  useEffect(() => {
    // Handle hash scrolling on initial load
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [])

  return (
    <main className="relative min-h-screen bg-background text-secondary">
      <Navbar />
      <AnimatedBackground />
      
      <div className="pt-20">
        <CompanyOverviewSection />
        <MissionVisionSection />
        <TeamSection />
      </div>

      <Footer />
    </main>
  )
}
