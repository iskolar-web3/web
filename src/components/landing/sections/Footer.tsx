import { Facebook, Linkedin, Github, Mail, Instagram } from "lucide-react"
import { useState } from "react"

const quickLinks = [
  { name: "Home", href: "/#home" },
  { name: "Features", href: "/#features" },
  { name: "Roadmap", href: "/#roadmap" },
  { name: "FAQs", href: "/#faqs" },
  { name: "Company Overview", href: "/about/#company-overview" },
  { name: "Mission & Vision", href: "/about/#mission-vision" },
  { name: "Our Team", href: "/about/#team" },
  { name: "Partnerships", href: "/about/#partnerships" },
]

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms" },
]

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/profile.php?id=61575967087555" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/107364901" },
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/iskolar_web3/" },
  { name: "Github", icon: Github, href: "https://github.com/iskolar-web3" },
]

export function Footer() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <footer className="bg-background text-tertiary relative z-20">
      {/* Horizontal line at top */}
      <div className="border-t border-secondary/20"></div>

      {/* Main Footer */}
      <div className="py-28 px-6 md:px-26">
        <div className="">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              {/* Logo */}
              <a href="#home" onClick={(e) => handleNavClick(e, '#home')}>
                <div className="w-25 h-10 md:w-34 md:h-14 flex items-center mb-2 justify-center">
                  <img
                    src={"/logo2.png"}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </a>
              <p className="text-secondary/80 text-sm leading-relaxed mb-6">
                Empowering students with accessible, transparent, and efficient scholarship opportunities.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary/90 transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg mb-4 text-secondary">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-secondary/80 hover:text-secondary transition-colors text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-secondary text-lg mb-4">Legal</h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-secondary/80 hover:text-secondary transition-colors text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-secondary text-lg mb-4">Contact Us</h4>
              <a
                href="mailto:scholarpass23@gmail.com"
                className="flex items-center gap-2 text-secondary/80 hover:text-secondary transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                scholarpass23@gmail.com
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-secondary text-sm">&copy; {new Date().getFullYear()} iSkolar. All rights reserved.</p>
            <p className="text-secondary text-sm">Made For Students, Made By Students.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}