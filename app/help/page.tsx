"use client";

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-[#0E0E0F] text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Help Center
        </h1>

        <p className="text-gray-400 mt-2 mb-10">
          Everything you need to use AI Videxa effectively
        </p>

        <div className="grid sm:grid-cols-2 gap-6">

          <HelpCard
            title="Getting Started"
            desc="Learn how to generate assignments, research & PPTs"
          />

          <HelpCard
            title="Assignments"
            desc="Basic vs Advanced mode explained"
          />

          <HelpCard
            title="Research Mode"
            desc="Depth levels, sources & best practices"
          />

          <HelpCard
            title="Export & PDFs"
            desc="Handwritten & normal PDF features"
          />

          <HelpCard
            title="Account & Settings"
            desc="Profile, history, privacy & preferences"
          />

          <HelpCard
            title="Troubleshooting"
            desc="Common issues & fixes"
          />
        </div>

      </div>
    </div>
  );
}

function HelpCard({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}
