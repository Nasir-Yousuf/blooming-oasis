import { Metadata } from "next";
import { Mail, Phone, MapPin, MessageSquare, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { LiveClock } from "@/components/shared/LiveClock";
import { InstagramIcon, FacebookIcon, PinterestIcon } from "@/components/shared/SocialIcons";

export const metadata: Metadata = {
  title: "Contact Us | Blooming Oasis Botanical Nursery",
  description:
    "Get in touch with our master botanists for plant care advice, order inquiries, or custom interior greenery consultations.",
};

export default function ContactPage() {
  return (
    <div className="bg-offwhite min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Hero */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream text-botanical border border-botanical/20 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Horticultural Advisory & Customer Care
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-forest tracking-tight leading-tight">
            Let&rsquo;s Talk Plants.
          </h1>
          <p className="text-base sm:text-lg text-charcoal/75 mt-3 leading-relaxed font-light">
            Questions about your plants, an order, or finding the perfect green companion? We&rsquo;re here to help.
          </p>
        </div>

        {/* Main Grid: Form (7 cols) + Contact Info & Live Clock (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Interactive Contact Form with Validation & Confirmation Modal */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Right Column: Contact Details, Live Greenhouse Time & Hours */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Clock Component (Section 8 Requirement) */}
            <LiveClock variant="contact" />

            {/* Demonstration Contact Details Card */}
            <div className="bg-cream/50 rounded-3xl p-6 sm:p-8 border border-sage/30 space-y-6">
              <h3 className="font-serif text-xl font-bold text-forest">
                Botanical Nursery & Studio
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-charcoal/80">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-offwhite flex items-center justify-center text-forest shadow-xs flex-shrink-0">
                    <MapPin className="w-4 h-4 text-botanical" />
                  </div>
                  <div>
                    <span className="font-semibold text-forest block">Physical Nursery & Greenhouse</span>
                    <span className="text-xs text-charcoal/70">
                      742 Botanical Way, Suite 4B
                      <br />
                      Verdant Green District, CA 94107
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-offwhite flex items-center justify-center text-forest shadow-xs flex-shrink-0">
                    <Mail className="w-4 h-4 text-botanical" />
                  </div>
                  <div>
                    <span className="font-semibold text-forest block">Digital Inquiries</span>
                    <span className="text-xs font-mono text-charcoal/70">
                      care@bloomingoasis.demo
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-offwhite flex items-center justify-center text-forest shadow-xs flex-shrink-0">
                    <Phone className="w-4 h-4 text-botanical" />
                  </div>
                  <div>
                    <span className="font-semibold text-forest block">Telephone Hotline</span>
                    <span className="text-xs font-mono text-charcoal/70">
                      +1 (800) 555-PLANT (7526)
                    </span>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="pt-4 border-t border-sage/20">
                <span className="text-xs font-semibold uppercase tracking-wider text-botanical block mb-2">
                  Greenhouse Hours
                </span>
                <div className="space-y-1.5 text-xs text-charcoal/80">
                  <div className="flex justify-between">
                    <span>Monday – Friday:</span>
                    <span className="font-mono font-medium">8:00 AM – 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-mono font-medium">9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-mono font-medium">10:00 AM – 5:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Social Channels with target="_blank" */}
              <div className="pt-4 border-t border-sage/20">
                <span className="text-xs font-semibold uppercase tracking-wider text-botanical block mb-3">
                  Botanical Social Channels
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-offwhite hover:bg-forest hover:text-offwhite text-charcoal transition-colors border border-sage/30"
                    aria-label="Instagram (opens in new tab)"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                  <a
                    href="https://pinterest.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-offwhite hover:bg-forest hover:text-offwhite text-charcoal transition-colors border border-sage/30"
                    aria-label="Pinterest (opens in new tab)"
                  >
                    <PinterestIcon className="w-4 h-4" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-offwhite hover:bg-forest hover:text-offwhite text-charcoal transition-colors border border-sage/30"
                    aria-label="Facebook (opens in new tab)"
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Live Chat Callout */}
            <div className="bg-forest text-offwhite rounded-3xl p-6 sm:p-7 border border-forest-light/40 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-forest-light flex items-center justify-center text-sage flex-shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-offwhite">
                  Need Immediate Advice?
                </h4>
                <p className="text-xs text-cream/80 mt-1 leading-relaxed">
                  Our Plant Specialist AI is available 24/7 on the bottom right corner to answer questions about leaf care, watering schedules, and pet non-toxicity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
