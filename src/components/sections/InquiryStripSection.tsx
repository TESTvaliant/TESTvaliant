// website for testvaliant
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const InquiryStripSection = () => {
  return (
    <section className="bg-primary py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <p className="text-primary-foreground font-medium text-lg">
            Have questions? We'd love to hear from you!
          </p>
          <Button 
            asChild 
            variant="secondary" 
            size="lg"
            className="group"
          >
            <Link to="/inquiry">
              Send an Inquiry
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InquiryStripSection;

