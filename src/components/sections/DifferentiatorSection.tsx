// website for testvaliant
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useDifferentiators } from "@/hooks/useSiteContent";

const DifferentiatorSection = forwardRef<HTMLElement>((_, ref) => {
  const { data: differentiatorsData } = useDifferentiators();

  const differentiators = differentiatorsData || [{
    title: "Personalized Learning Paths",
    description: "AI-powered study plans that adapt to your strengths and weaknesses for maximum efficiency."
  }, {
    title: "Live Interactive Classes",
    description: "Real-time doubt solving with top educators, not pre-recorded videos."
  }];

  return (
    <section ref={ref} id="Why Choose Us" className="bg-section-primary relative py-[30px]">
      {/* Simplified decorative effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-dots-pattern opacity-40 pointer-events-none" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
            What kind of a learner are you?
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            <span className="text-gradient">Different learners,</span>different preparation needs
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Years of classroom experience showed us that learners approach English, exams, and preparation very
            differently.<br />These resources are designed to work across learning styles: not just one type.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {differentiators.map((item: any, index: number) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
              className="text-center md:text-left"
            >
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mb-4 mx-auto md:mx-0">
                <Check className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

DifferentiatorSection.displayName = "DifferentiatorSection";

export default DifferentiatorSection;

