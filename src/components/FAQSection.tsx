import { HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="my-10 rounded-2xl border border-white/10 bg-[#0f1118] p-6 sm:p-8">
      <div className="mb-6 flex items-center space-x-3 border-b border-white/10 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400">
            Key questions and tactical answers analyzed by TrendIntel Bureau
          </p>
        </div>
      </div>

      <div className="divide-y divide-white/5 space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="pt-4 first:pt-0">
            <h3 className="text-base font-semibold text-amber-300">
              {faq.question}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
