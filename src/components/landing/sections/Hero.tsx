import { Button } from "@/components/ui/button"
import { ArrowRight, Search } from "lucide-react"
import { MotionContainer, MotionItem } from "@/components/landing/MotionContainer"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Graduation cap shape with animated gradient */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-[8%] right-[2%] w-[400px] h-[300px] md:w-[500px] md:h-[380px] lg:w-[550px] lg:h-[425px] opacity-20"
        >
          <svg viewBox="0 0 200 150" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              {/* Animated gradient for the cap */}
              <linearGradient id="capGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3A52A6">
                  <animate
                    attributeName="stop-color"
                    values="#3A52A6;#efa508;#F8FAFC;#3A52A6"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="50%" stopColor="#efa508">
                  <animate
                    attributeName="stop-color"
                    values="#efa508;#F8FAFC;#3A52A6;#efa508"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor="#F8FAFC">
                  <animate
                    attributeName="stop-color"
                    values="#F8FAFC;#3A52A6;#efa508;#F8FAFC"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>
              {/* Glow filter */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Cap top (mortarboard) */}
            <polygon
              points="100,20 180,55 100,90 20,55"
              fill="url(#capGradient)"
              filter="url(#glow)"
              className="animate-pulse"
              style={{ animationDuration: "4s" }}
            />

            {/* Cap base/head part */}
            <ellipse cx="100" cy="85" rx="35" ry="30" fill="url(#capGradient)" opacity="0.8" />

            {/* Tassel string */}
            <path
              d="M100,55 Q115,70 110,100"
              stroke="url(#capGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                values="M100,55 Q115,70 110,100;M100,55 Q120,75 115,105;M100,55 Q115,70 110,100"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>

            {/* Tassel end */}
            <circle cx="110" cy="105" r="6" fill="url(#capGradient)">
              <animate attributeName="cx" values="110;115;110" dur="3s" repeatCount="indefinite" />
              <animate attributeName="cy" values="105;110;105" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>
        </motion.div>

        {/* Secondary smaller cap on left - more subtle */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
          animate={{ opacity: 0.15, scale: 1, rotate: -15 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="absolute bottom-[15%] left-[3%] w-[200px] h-[150px] md:w-[300px] md:h-[210px] opacity-15 rotate-[-15deg]"
        >
          <svg viewBox="0 0 200 150" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="capGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#efa508">
                  <animate
                    attributeName="stop-color"
                    values="#efa508;#3A52A6;#efa508"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor="#3A52A6">
                  <animate
                    attributeName="stop-color"
                    values="#3A52A6;#efa508;#3A52A6"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>
            </defs>

            <polygon points="100,20 180,55 100,90 20,55" fill="url(#capGradient2)" />
            <ellipse cx="100" cy="85" rx="40" ry="15" fill="url(#capGradient2)" opacity="0.8" />
          </svg>
        </motion.div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-[#efa508]/5 z-0" />

      <MotionContainer
        className="relative z-10 max-w-5xl mx-auto text-center"
        staggerDelay={0.2}
      >
        <MotionItem>
          <strong className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-secondary leading-tight text-balance block">
            Discover, Apply, and Receive Scholarships
            <span className="text-[#6073F2] block mt-2">All in One Place</span>
          </strong>
        </MotionItem>

        <MotionItem>
          <p className="text-lg sm:text-xl text-secondary/80 max-w-2xl mx-auto mt-12 mb-10 text-pretty leading-relaxed">
            A centralized platform connecting students with scholarship providers — making education
            accessible and transparent.
          </p>
        </MotionItem>

        {/* Scroll indicator */}
        <MotionItem variants={{
           hidden: { opacity: 0, y: -20 },
           visible: { opacity: 1, y: 0, transition: { delay: 1, duration: 0.5 } }
        }}>
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-secondary/50 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-secondary rounded-full animate-pulse" />
            </div>
          </div>
        </MotionItem>
      </MotionContainer>
    </section>
  )
}