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

        {/* 3D Graduation Cap */}
        <motion.div 
          initial={{ opacity: 0, y: 50, rotate: -5 }}
          animate={{ opacity: 0.1, y: 0, rotate: -5 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute -bottom-[5%] md:-bottom-[20%] -left-[3%] w-[500px] h-[500px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px] opacity-100"
        >
          {/* Floating CSS Animation Container */}
          <div 
            className="w-full h-full"
            style={{ 
              animation: 'float-soothing 8s ease-in-out infinite',
              transformOrigin: 'center center'
            }}
          >
            <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
              <defs>
                {/* Rich 3D Gradients */}
                <linearGradient id="boardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" /> {/* Blue-600 */}
                  <stop offset="50%" stopColor="#3B82F6" /> {/* Blue-500 */}
                  <stop offset="100%" stopColor="#1E40AF" /> {/* Blue-800 */}
                </linearGradient>
                
                <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1E3A8A" /> {/* Blue-900 (Darker for depth) */}
                  <stop offset="100%" stopColor="#172554" /> {/* Blue-950 */}
                </linearGradient>

                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FCD34D" /> {/* Amber-300 */}
                  <stop offset="50%" stopColor="#F59E0B" /> {/* Amber-500 */}
                  <stop offset="100%" stopColor="#B45309" /> {/* Amber-700 */}
                </linearGradient>

                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <g transform="translate(200, 150) rotate(15)">
                {/* Skullcap (Base) */}
                <path 
                  d="M-50,15 Q0,45 50,15 L50,0 Q0,30 -50,0 Z" 
                  fill="#1E3A8A" 
                  opacity="0.6"
                />

                {/* Mortarboard (Diamond Top) - 3D Perspective */}
                <path
                  d="M0,-60 L130,0 L0,60 L-130,0 Z"
                  fill="url(#boardGradient)"
                  stroke="#3B82F6"
                  strokeWidth="0.5"
                />
                
                {/* Mortarboard Edge (Thickness) */}
                <path
                  d="M-130,0 L0,60 L130,0 L130,5 L0,65 L-130,5 Z"
                  fill="url(#edgeGradient)"
                />

                {/* Central Button */}
                <circle cx="0" cy="0" r="6" fill="url(#goldGradient)" filter="url(#softGlow)" />

                {/* Tassel Cord - Animated Physics */}
                <g>
                   <animateTransform 
                      attributeName="transform" 
                      type="rotate" 
                      values="-2 0 0; 2 0 0; -2 0 0" 
                      dur="4s" 
                      repeatCount="indefinite" 
                      calcMode="spline"
                      keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
                      opacity="0.6"
                   />
                   
                   {/* String */}
                   <path 
                    d="M0,0 Q30,20 60,60" 
                    fill="none" 
                    stroke="#F59E0B" 
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.6"
                   />
                   
                   {/* Tassel Fringe */}
                   <circle cx="60" cy="60" r="8" fill="url(#goldGradient)" />
                   <path 
                    d="M55,65 L52,90 M60,68 L60,95 M65,65 L68,90" 
                    stroke="#F59E0B" 
                    strokeWidth="2"
                    opacity="0.5"
                   />
                </g>
              </g>
            </svg>
          </div>
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