import { MotionContainer, MotionItem } from "@/components/landing/MotionContainer"
import { Linkedin } from "lucide-react"

const Card = ({ image, name, role, link, isLead = false }: { image: string; name: string; role: string; link: string; isLead?: boolean }) => (
  <div className={`
    relative bg-card/75 backdrop-blur-sm border border-secondary/10 shadow-lg rounded-xl
    flex flex-col items-center text-center p-6
    ${isLead ? 'border-secondary/30 shadow-secondary/10' : ''}
    w-full min-w-[240px] max-w-[280px]
    transition-transform hover:-translate-y-1 duration-300 group
  `}>
    <img 
      src={image} 
      alt="" 
      className="w-28 h-28 rounded-full mb-4 overflow-hidden object-cover border-2 border-secondary/20 group-hover:border-secondary/50 transition-colors"
    />
    <h3 className="text-xl font-bold text-secondary mb-1">{name}</h3>
    <p className="text-sm text-secondary/85 mb-4">{role}</p>
    <a href={link} target="_blank" className="p-2 text-secondary/80 hover:text-secondary rounded-full transition-all">
      <Linkedin className="w-5 h-5" />
    </a>
  </div>
)

export default function TeamSection() {
  return (
    <div id="team" className="bg-background py-36 pb-24 text-secondary w-full overflow-hidden">
      <MotionContainer>
        <div className="px-4 sm:px-12 lg:px-26 max-w-7xl mx-auto relative z-26">
          <h2 className="text-4xl md:text-5xl mb-4 text-center text-secondary">
            Meet Our Team
          </h2>
          <p className="text-center text-secondary/80 mb-16 max-w-2xl mx-auto text-lg">
            The dreamers, builders, and students behind iSkolar.
          </p>
          
          <div className="flex flex-col items-center">
              {/* Horizontal Team Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl justify-items-center">
                  <MotionItem>
                      <Card image="/team/CEO.jpg" name="Justin Luzano" role="Founder & CEO" link="https://www.linkedin.com/in/justinluzano23/" isLead />
                  </MotionItem>
                  
                  <MotionItem>
                      <Card image="/team/COO.jpg" name="Adam Ruadilla" role="Co-Founder & COO" link="https://www.linkedin.com/in/adam-r-35946332a/" />
                  </MotionItem>

                  <MotionItem>
                      <Card image="/team/CTO.jpg" name="Louigie Caminoy" role="Co-Founder & CTO" link="https://www.linkedin.com/in/louie1221" />  
                  </MotionItem>

                  <MotionItem>
                      <Card image="/team/CFO.jpg" name="Jeselle Francisco" role="CFO" link="https://www.linkedin.com/in/maria-jeselle-francisco-736491369/" />  
                  </MotionItem>
              </div>
          </div>
        </div>
      </MotionContainer>
    </div>
  )
}
