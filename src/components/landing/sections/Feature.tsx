import { PlusCircle, Search, ClipboardList, Users, Wallet } from "lucide-react"
import { MotionContainer, MotionItem } from "@/components/landing/MotionContainer"

const features = [
  {
    icon: PlusCircle,
    title: "Scholarship Creation",
    description: "Sponsors can set up scholarships with eligibility rules that fit their goals.",
    position: "left-top",
    number: "01",
  },
  {
    icon: Search,
    title: "Browsing & Application",
    description: "Students' find and apply to scholarships that match their field.",
    position: "left-bottom",
    number: "02",
  },
  {
    icon: ClipboardList,
    title: "Application Tracking",
    description: "Real-time updates from submission to disbursement.",
    position: "center",
    number: "03",
  },
  {
    icon: Users,
    title: "Scholar Selection",
    description: "Evaluate applications and manage selection efficiently with built-in tools.",
    position: "right-bottom",
    number: "04",
  },
  {
    icon: Wallet,
    title: "Fund Disbursement",
    description: "Transparent tracking ensures accountability and trust.",
    position: "right-top",
    number: "05",
  },
]

export function Features() {
  return (
    <section id="features" className="py-16 lg:py-28 px-6 md:px-26 bg-background">
      <MotionContainer className="mx-auto">
        {/* Section Header */}
        <MotionItem className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-2">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-sm text-secondary uppercase tracking-wider">
              Core Features
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-secondary mt-4 mb-6 text-balance">
            Everything You Need, <span className="text-[#6073F2]">All in One Place</span>
          </h2>
          <p className="text-lg text-secondary/80 max-w-2xl mx-auto text-pretty">
            Comprehensive tools for every step of the scholarship journey.
          </p>
        </MotionItem>

        {/* V-Shape Staircase Layout */}
        <div className="relative">
          {/* Mobile: Simple Stack */}
          <div className="lg:hidden space-y-6">
            {features.map((feature) => (
              <MotionItem
                key={feature.title}
                className="group relative overflow-hidden bg-card rounded-lg border-2 border-secondary/10 p-6 transition-all duration-500 hover:border-[#6073F2]/30 hover:shadow-lg"
              >
                {/* Background Icon */}
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-400 pointer-events-none">
                  <feature.icon className="w-32 h-32 text-secondary" />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

                <div className="relative">
                  <div className="flex items-start gap-4 mb-3">
                    <span className="text-2xl font-semibold text-secondary/30 group-hover:text-[#6073F2]/50 transition-colors duration-400">
                      #{feature.number}
                    </span>
                    <h3 className="text-xl text-secondary group-hover:text-secondary pt-1 transition-colors duration-400">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-secondary/75 leading-relaxed group-hover:text-secondary/85 transition-colors duration-400 pl-14">
                    {feature.description}
                  </p>
                </div>
              </MotionItem>
            ))}
          </div>

          {/* Desktop: V-Shape Staircase with Arrow */}
          <div className="hidden lg:block relative">
            <div className="relative" style={{ minHeight: '750px', zIndex: 2 }}>
              {features.map((feature, index) => {
                let positionClasses = ""
                // delayMultiplier logic is handled by specific MotionItem delay override or utilizing stagger effectively. 
                // Since this uses absolute positioning, simple stagger might not look correct if valid DOM order != visual order.
                // Re-calculating delay based on "visual" flow if needed, but here simple mapping index is roughly visual order except center.
                // Let's use custom delay for precise control similar to original.
                
                let delay = 0
                switch (feature.position) {
                  case "left-top":
                    positionClasses = "absolute left-0 top-0"
                    delay = 0
                    break
                  case "left-bottom":
                    positionClasses = "absolute left-30 top-[250px]"
                    delay = 0.15
                    break
                  case "center":
                    positionClasses = "absolute left-1/2 -translate-x-1/2 top-[400px]"
                    delay = 0.3
                    break
                  case "right-bottom":
                    positionClasses = "absolute right-30 top-[250px]"
                    delay = 0.6 // Show after right-top to make it symmetrical? Or just flow left to right?
                    // Original code:
                    // left-top: 0
                    // left-bottom: 1
                    // center: 2
                    // right-top: 3
                    // right-bottom: 4
                    // So flow is LeftTop -> LeftBottom -> Center -> RightTop -> RightBottom
                    delay = 0.6
                     break
                  case "right-top":
                    positionClasses = "absolute right-0 top-0"
                    delay = 0.45
                    break
                }
                
                // Correcting the sequence to match original intent: LeftTop(0), LeftBottom(1), Center(2), RightTop(3), RightBottom(4)
                 if (feature.position === "right-top") delay = 0.45
                 if (feature.position === "right-bottom") delay = 0.6
                
                return (
                  <MotionItem
                    key={feature.title}
                    className={`${positionClasses} w-[320px]`}
                    variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { 
                            opacity: 1, 
                            y: 0,
                            transition: {
                                delay: delay, 
                                duration: 0.7,
                                ease: "easeOut"
                            }
                        }
                    }}
                  >
                    <div className="group relative overflow-hidden bg-card rounded-3xl border border-secondary/5 p-8 transition-all duration-400 hover:border-secondary/15 hover:shadow-lg hover:-translate-y-1 shadow-sm">
                      {/* Background Icon */}
                      <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-400 pointer-events-none">
                        <feature.icon className="w-48 h-48 text-secondary" />
                      </div>

                      <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                          <span className="text-3xl font-semibold text-secondary/50 group-hover:text-secondary transition-colors duration-400">
                            #{feature.number}
                          </span>
                        </div>
                        
                        <h3 className="text-xl text-secondary mb-3 group-hover:text-secondary transition-colors duration-400 leading-tight">
                          {feature.title}
                        </h3>
                        <p className="text-secondary/75 leading-relaxed group-hover:text-secondary/85 transition-colors duration-400 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </MotionItem>
                )
              })}

              {/* Center Text Component */}
              <MotionItem
                className="absolute left-1/2 -translate-x-1/2 top-10"
                style={{ zIndex: 3 }}
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: 0.3, duration: 0.7 }
                    }
                }}
              >
                <div className="text-center max-w-md px-6 py-8">
                  <h3 className="text-3xl text-secondary mb-3 font-medium">
                    Seamless Integration
                  </h3>
                  <p className="text-secondary/80 text-sm leading-relaxed">
                    Every feature works together to create a unified scholarship management experience
                  </p>
                </div>
              </MotionItem>
            </div>
          </div>
        </div>
      </MotionContainer>
    </section>
  )
}