import { createFileRoute } from "@tanstack/react-router"
import { usePageTitle } from "@/hooks/usePageTitle"
import Navbar from "@/components/landing/Navbar"
import AnimatedBackground from "@/components/landing/AnimatedBackground"
import { Footer } from "@/components/landing/sections/Footer"
import { MotionContainer } from "@/components/landing/MotionContainer"

export const Route = createFileRoute("/_landing/company-overview")({
  component: CompanyOverview,
})

function CompanyOverview() {
  usePageTitle("Company Overview")

  return (
    <main className="relative min-h-screen bg-background text-secondary">
      <Navbar />
      <AnimatedBackground />
      
      <div className="pt-32 pb-16 relative z-10">
        <MotionContainer>
          <div className="px-4 sm:px-12 lg:px-26 max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl mb-10 text-center text-secondary">
              Company Overview
            </h1>
            
            <div className="bg-card/75 backdrop-blur-sm border border-secondary/10 rounded-2xl px-12 py-8 shadow-xl">
              <div className="prose prose-lg dark:prose-invert max-w-none text-secondary/80">
                <p className="text-lg leading-relaxed mb-12">
                  iSkolar is a scholarship hub platform that connects students directly with scholarship providers, digitalizing and automating scholarship processes while making fund disbursements fully transparent.
                </p>
                
                <h2 className="text-2xl mb-4 text-secondary">Who We Are</h2>
                <p className="mb-6 text-secondary/80">
                  We are a team of student dreamers, developers, and builders who understand the challenges of funding education. Our platform connects students with scholarship providers, institutions, and organizations that are eager to support the next generation of leaders.
                </p>

                <h2 className="text-2xl mb-4 text-secondary">What We Do</h2>
                <p className="text-secondary/80">
                  Our ecosystem provides a seamless interface for students to find scholarships that match their profile, while giving sponsors an efficient management system to review applications and track the impact of their contributions.
                </p>
              </div>
            </div>
          </div>
        </MotionContainer>
      </div>

      <Footer />
    </main>
  )
}
