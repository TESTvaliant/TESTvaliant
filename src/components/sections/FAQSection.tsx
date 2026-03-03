// website for testvaliant
import { forwardRef, memo } from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useFaqs } from "@/hooks/useSiteContent";
import { sanitizeHtml } from "@/lib/sanitize";

const FAQSection = forwardRef<HTMLElement>((_, ref) => {
  const { data: faqsData } = useFaqs();

  const faqs = faqsData || [{
    question: "How do I get started with TESTvaliant?",
    answer: "Getting started is easy! Simply sign up for a free account and we'll recommend the perfect learning path for your target exam."
  }];

  return (
    <section ref={ref} id="faq" className="bg-section-warm relative py-[30px]">
      {/* Simplified decorative elements */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-secondary/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-dots-pattern opacity-30 pointer-events-none" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know about TESTvaliant. Can't find an answer? 
            Chat with our support team.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq: any, index: number) => (
              <AccordionItem
                key={faq.id || index}
                value={`item-${index}`}
                className="bg-card rounded-xl px-6 shadow-sm border-none data-[state=open]:shadow-card"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-secondary hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  <div 
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.answer) }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
});

FAQSection.displayName = "FAQSection";

export default memo(FAQSection);

