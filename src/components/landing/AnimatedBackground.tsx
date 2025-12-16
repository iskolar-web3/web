import { useEffect, useState } from "react"

type IconType = "graduationCap" | "book" | "certificate" | "pencil" | "lightbulb" | "star" | "trophy"

interface FloatingIcon {
  id: number
  size: number
  x: number
  y: number
  delay: number
  duration: number
  opacity: number
  type: IconType
  rotation: number
}

const iconTypes: IconType[] = ["graduationCap", "book", "certificate", "pencil", "lightbulb", "star", "trophy"]

function GraduationCap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
    </svg>
  )
}

function Book({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
    </svg>
  )
}

function Certificate({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4 3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h8v5l3-3 3 3v-5h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H4zm0 2h16v10h-6v1.88l-1-1-1 1V15H4V5zm2 2v2h12V7H6zm0 4v2h8v-2H6z" />
    </svg>
  )
}

function Pencil({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  )
}

function Lightbulb({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z" />
    </svg>
  )
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  )
}

function Trophy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  )
}

function IconRenderer({ type, className }: { type: IconType; className?: string }) {
  switch (type) {
    case "graduationCap":
      return <GraduationCap className={className} />
    case "book":
      return <Book className={className} />
    case "certificate":
      return <Certificate className={className} />
    case "pencil":
      return <Pencil className={className} />
    case "lightbulb":
      return <Lightbulb className={className} />
    case "star":
      return <Star className={className} />
    case "trophy":
      return <Trophy className={className} />
    default:
      return <GraduationCap className={className} />
  }
}

export default function AnimatedBackground() {
  const [icons, setIcons] = useState<FloatingIcon[]>([])

  useEffect(() => {
    const generatedIcons: FloatingIcon[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      size: Math.random() * 32 + 18,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 6 + 8,
      opacity: Math.random() * 0.12 + 0.04,
      type: iconTypes[Math.floor(Math.random() * iconTypes.length)],
      rotation: Math.random() * 30 - 15,
    }))
    setIcons(generatedIcons)
  }, [])

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(var(--rotation));
          }
          50% {
            transform: translateY(-20px) rotate(var(--rotation));
          }
        }
      `}</style>
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 25 }}>
        {icons.map((icon) => (
          <div
            key={icon.id}
            className="absolute"
            style={{
              left: `${icon.x}%`,
              top: `${icon.y}%`,
              width: icon.size,
              height: icon.size,
              opacity: icon.opacity,
              color: '#3b82f6',
              animation: `float ${icon.duration}s ease-in-out infinite`,
              animationDelay: `${icon.delay}s`,
              // @ts-ignore
              '--rotation': `${icon.rotation}deg`,
            }}
          >
            <IconRenderer type={icon.type} className="w-full h-full" />
          </div>
        ))}
      </div>
    </>
  )
}