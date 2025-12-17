export function CTA() {
  return (  
    <section id="get-started" className="bg-secondary py-75 px-4">
      <div className="text-center relative z-26">
        <h2 className="text-3xl sm:text-4xl text-tertiary mb-4 text-balance">
          Ready to Start Your Scholarship Journey?
        </h2>
          <p className="text-tertiary/80 text-lg mb-8 max-w-2xl mx-auto">
            Join students, sponsors, and schools preparing for the future of scholarship management.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-tertiary text-secondary rounded-md hover:bg-tertiary/75 transition-colors"
            >
              Get Early Access
            </a>
          </div>
      </div>  
    </section>
  )
}