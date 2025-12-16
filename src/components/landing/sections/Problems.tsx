import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { FileX, Clock, EyeOff, AlertTriangle } from "lucide-react"

const problems = [
  {
    number: "01",
    title: "Fragmented Opportunities",
    description: "Scholarship info is scattered across platforms, making it hard to discover all options.",
  },
  {
    number: "02",
    title: "Manual Processes",
    description: "Paper-based applications waste time for students and coordinators alike.",
  },
  {
    number: "03",
    title: "Lack of Transparency",
    description: "No visibility into application status or disbursement details.",
  },
  {
    number: "04",
    title: "Limited Accessibility",
    description: "Students in remote areas face barriers accessing scholarship information.",
  },
]

export function Problem() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <section id="problem" className="py-16 lg:py-28 px-6 md:px-26 bg-background">
      <div ref={ref} className="max-w-8xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-30"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-2">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-sm text-secondary uppercase tracking-wider">
              The Challenge
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-secondary mt-4 mb-6 text-balance">
            Why Scholarships Remain <span className="text-[#6073F2]">Out of Reach</span>
          </h2>
          <p className="text-lg text-secondary/80 max-w-2xl mx-auto text-pretty">
            Many deserving students miss out on scholarships due to systemic challenges.
          </p>
        </motion.div>

        {/* Problem Items - Horizontal Layout */}
        <motion.div
          className="space-y-8 lg:space-y-16"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {problems.map((problem, index) => (
            <motion.div
              key={problem.number}
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-7 gap-6 md:gap-8 items-start group"
            >
              {/* Column 1: Problem Number */}
              <motion.div
                variants={iconVariants}
                className="flex items-center justify-start"
              >
                <span className="text-3xl md:text-4xl font-semibold text-secondary opacity-50 group-hover:opacity-80 transition-opacity duration-400">
                  #{problem.number}
                </span>
              </motion.div>

              {/* Column 2: Images */}
               <motion.div
                variants={iconVariants}
                className="flex items-center col-span-2 justify-start"
              >
                <div className="relative w-46 h-30 md:w-74 md:h-48 flex items-center p-1 border-2 border-secondary justify-center overflow-hidden rounded-lg">
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-secondary/10 group-hover:from-secondary/30 rounded-lg group-hover:to-secondary/15 transition-all duration-400" />
                  {/* Image placeholder - replace src with actual image URLs */}
                  <motion.img
                    src={`problem-${problem.number}.jpg`}
                    alt={problem.title}
                    className="w-full h-full object-cover rounded-md relative z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-400"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>

              {/* Column 3: Title */}
              <div className="flex items-center col-span-2 justify-start">
                <motion.h3
                  className="text-xl md:text-2xl text-secondary/75 mb-2 group-hover:text-secondary transition-colors duration-400"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.3 + index * 0.15 }}
                >
                  {problem.title}
                </motion.h3>
              </div>

              {/* Column 4: Description */}
              <div className="flex items-center col-span-2 justify-start">
                <motion.p
                  className="text-base text-secondary/75 opacity-70 leading-relaxed group-hover:text-secondary transition-opacity duration-400"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.4 + index * 0.15 }}
                >
                  {problem.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}