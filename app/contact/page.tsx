export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
      <section className="w-full max-w-2xl px-6 py-24 text-white">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            Contact AI Videxa
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">
            We’re here to help with questions, feedback, or support related to
            AI Videxa. Reach out and we’ll get back to you as soon as possible.
          </p>
        </header>

        {/* Contact Cards */}
        <div className="grid gap-6">
          {/* Support */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-medium mb-2">Customer Support</h2>
            <p className="text-white/70 mb-3">
              For account issues, technical problems, or general questions.
            </p>
            <p className="text-white font-medium">
              📧 support@aividexa.com
            </p>
          </div>

          {/* Business */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-medium mb-2">
              Business & Partnerships
            </h2>
            <p className="text-white/70 mb-3">
              For partnerships, collaborations, or enterprise inquiries.
            </p>
            <p className="text-white font-medium">
              📧 business@aividexa.com
            </p>
          </div>

          {/* Legal */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-medium mb-2">Legal & Privacy</h2>
            <p className="text-white/70 mb-3">
              For legal questions, data requests, or privacy concerns.
            </p>
            <p className="text-white font-medium">
              📧 legal@aividexa.com
            </p>
          </div>

          {/* Website */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-white/70">
              Official Website
            </p>
            <p className="text-white font-medium mt-1">
              🌐 www.aividexa.com
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-white/50 text-sm mt-12">
          We usually respond within 24–48 business hours.
        </p>
      </section>
    </main>
  );
}
