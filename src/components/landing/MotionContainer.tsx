import { motion, type HTMLMotionProps, type Variants } from "framer-motion"
import type { ReactNode } from "react"

interface MotionContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  staggerDelay?: number
  delayChildren?: number
  className?: string
  viewportMargin?: string
}

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom: { staggerDelay: number; delayChildren: number } = { staggerDelay: 0.1, delayChildren: 0 }) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.staggerDelay,
      delayChildren: custom.delayChildren,
    },
  }),
}

const defaultItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      duration: 0.5,
    },
  },
}

export function MotionContainer({
  children,
  staggerDelay = 0.1,
  delayChildren = 0,
  className,
  viewportMargin = "-100px",
  variants = defaultContainerVariants,
  ...props
}: MotionContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin }}
      custom={{ staggerDelay, delayChildren }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface MotionItemProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  className?: string
}

export function MotionItem({
  children,
  className,
  variants = defaultItemVariants,
  ...props
}: MotionItemProps) {
  return (
    <motion.div variants={variants} className={className} {...props}>
      {children}
    </motion.div>
  )
}
