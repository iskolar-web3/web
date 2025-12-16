import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import {
  GraduationCap,
  Building2,
  School,
  Landmark,
  BookOpen,
  UserRound,
  Heart,
} from "lucide-react"

const userTypes = [
  {
    icon: GraduationCap,
    title: "Students",
    subtitle: "Aspiring Scholars",
    color: "bg-secondary",
    description:
      "Discover scholarships, apply with ease, and track your applications in real-time.",
    features: [
      "Browse curated scholarships",
      "One-click applications",
      "Real-time tracking",
    ],
    subTypes: [
      { icon: BookOpen, label: "Pre-College" },    
      { icon: UserRound, label: "Undergraduates" }, 
    ],
  },
  {
    icon: Building2,
    title: "Sponsors",
    subtitle: "Scholarship Providers",
    color: "bg-secondary",
    description: "Create programs, evaluate applicants, and track disbursements transparently.",
    features: ["Create scholarship programs", "Evaluate efficiently", "Fund tracking"],
    subTypes: [
      { icon: Heart, label: "Individuals" },
      { icon: Building2, label: "Organizations" },
      { icon: Landmark, label: "Governments" },
    ],
  },
  {
    icon: School,
    title: "Schools",
    subtitle: "Educational Institutions",
    color: "bg-secondary",
    description:
      "Monitor programs, ensure compliance, and collaborate with sponsors.",
    features: [
      "Student monitoring",
      "Monitor tuition payments",
      "Dashboard for compliance",
    ],
    subTypes: [
      { icon: Landmark, label: "Public" },
      { icon: Building2, label: "Private" },
    ],
  },
]

export function TargetUsers() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="about" className="py-20 lg:py-32 px-6 md:px-26 bg-background to-blue-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div
        ref={ref}
        className={`relative z-10 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-2">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-sm text-secondary uppercase tracking-wider">Who It's For</span>
          </div>
          <h2 className="text-4xl sm:text-4xl lg:text-5xl text-secondary mt-4 mb-6 text-balance">
            Built for the Entire Ecosystem
          </h2>
          <p className="text-lg text-secondary/80 max-w-2xl mx-auto text-pretty">
            iSkolar serves every stakeholder in the scholarship journey
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid lg:grid-cols-3 gap-6">
          {userTypes.map((user, index) => (
            <div
              key={user.title}
              className={`group relative transition-all duration-500 hover:translate-y-[-4px] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-500 border border-secondary/15 overflow-hidden h-full flex flex-col">
                {/* Title and Subtitle */}
                <div className="pt-6 px-8 pb-3">
                  <h3 className="text-2xl font-semibold text-secondary">{user.title}</h3>
                  <p className="text-secondary/90 text-sm mt-1">{user.subtitle}</p>
                </div>

                {/* Description */}
                <div className="px-8 py-2 flex-grow">
                  <p className="text-secondary/80 text-sm leading-relaxed">{user.description}</p>
                </div>

                {user.subTypes && (
                  <div className="px-8 py-4 flex flex-wrap gap-2">
                    {user.subTypes.map((subType) => (
                      <div
                        key={subType.label}
                        className="flex items-center gap-1.5 bg-secondary/5 text-secondary px-2 py-1.5 rounded-sm text-xs hover:bg-secondary/10 transition-colors"
                      >
                        <subType.icon className="w-3.5 h-3.5" />
                        {subType.label}
                      </div>
                    ))}
                  </div>
                )}

                {/* Features List */}
                <div className="px-8 py-6 border-t border-secondarty/10">
                  <ul className="space-y-2">
                    {user.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-secondary">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}