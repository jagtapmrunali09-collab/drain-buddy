import { useState } from "react";
import { ChevronDown } from "lucide-react";
import EmergencyNumbers from "../components/EmergencyNumbers.jsx";
import WhatsAppButton from "../components/WhatsAppButton.jsx";
import { ReadAloudButton } from "../components/VoiceAssistant.jsx";

const FAQS = [
  {
    q: "How do I report a blocked or overflowing drain?",
    a: "Sign in to your citizen account, go to \"Report a drain issue\", and fill in the title, category, and description. You can attach a photo and tag your GPS location so field crews can find the spot quickly.",
  },
  {
    q: "How long does it take for a complaint to be resolved?",
    a: "Every complaint gets a resolution deadline set by the municipal team, usually within a few days. Higher-priority issues — like those overlapping a live sensor alert — are resolved faster. You can track the exact deadline and status updates from \"My complaints\".",
  },
  {
    q: "Do I need to attach a photo or location?",
    a: "Both are optional but strongly recommended. A photo helps crews assess severity before dispatch, and a location pin means they don't have to search for the exact spot.",
  },
  {
    q: "How does the AI decide which drains are high risk?",
    a: "Drain-Buddy combines live IoT sensor readings (water level, flow, blockage percentage), computer vision analysis of camera feeds, historical flooding data, and citizen reports into a single risk score per ward, shown on the live map.",
  },
  {
    q: "Can I use Drain-Buddy in my own language?",
    a: "Yes. Use the language switcher in the top navigation bar to change between English, Hindi, and Marathi. The voice assistant also understands basic navigation commands.",
  },
  {
    q: "What should I do in a flood emergency right now?",
    a: "Do not wait for a complaint response in an emergency — call the numbers listed below immediately, and move to higher ground if water is rising rapidly.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="container-page py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="flex items-start justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Frequently asked questions</h1>
            <p className="text-sm text-subink mt-1">Can't find what you need? Message the corporation directly below.</p>
          </div>
        </div>

        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={f.q} className="card overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm font-medium text-ink">{f.q}</span>
                <ChevronDown size={18} className={`text-subink shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-subink leading-relaxed mb-2">{f.a}</p>
                  <ReadAloudButton text={f.a} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink mb-3">Still need help?</h3>
          <WhatsAppButton />
        </div>
        <EmergencyNumbers />
      </div>
    </div>
  );
}
