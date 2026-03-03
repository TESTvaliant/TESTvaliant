import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Send, ArrowLeft, User, Phone, Mail, MessageSquare, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be less than 15 digits").regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

const Inquiry = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-inquiry", {
        body: data,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Your inquiry has been sent successfully!");
      form.reset();
    } catch (error) {
      console.error("Error sending inquiry:", error);
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Send Your Inquiry | TestValiant"
        description="Send us your inquiry and we'll get back to you soon."
      />
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Link 
              to="/" 
              className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left side - Info */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2 space-y-6"
              >
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                    Get in <span className="text-primary">Touch</span>
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Have questions about our programs? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Email Us</h3>
                      <p className="text-muted-foreground text-sm">testtheenglishschoolofthought@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Quick Response</h3>
                      <p className="text-muted-foreground text-sm">We typically respond within 24 hours</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right side - Form */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-span-3"
              >
                <div className="bg-card rounded-3xl shadow-xl border border-border/50 p-8 lg:p-10">
                  {isSubmitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">Thank You!</h3>
                      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                        Your inquiry has been sent successfully. We'll get back to you within 24 hours.
                      </p>
                      <Button asChild size="lg" className="rounded-xl">
                        <Link to="/">Return to Home</Link>
                      </Button>
                    </motion.div>
                  ) : (
                    <>
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground">Send Your Inquiry</h2>
                        <p className="text-muted-foreground mt-1">All fields are required *</p>
                      </div>

                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground font-medium">
                                  Full Name <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input 
                                      placeholder="Enter your full name" 
                                      className="pl-12 h-12 rounded-xl border-border/60 focus:border-primary" 
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground font-medium">
                                  Phone Number <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input 
                                      placeholder="Enter your phone number" 
                                      className="pl-12 h-12 rounded-xl border-border/60 focus:border-primary" 
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground font-medium">
                                  Email Address <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input 
                                      type="email" 
                                      placeholder="Enter your email address" 
                                      className="pl-12 h-12 rounded-xl border-border/60 focus:border-primary" 
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground font-medium">
                                  Your Inquiry <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                                    <Textarea 
                                      placeholder="Write your message here..." 
                                      className="pl-12 pt-3 min-h-[140px] rounded-xl border-border/60 focus:border-primary resize-none"
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button 
                            type="submit" 
                            className="w-full h-14 text-lg rounded-xl font-semibold" 
                            size="lg"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-5 w-5" />
                                Submit Inquiry
                              </>
                            )}
                          </Button>
                        </form>
                      </Form>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Inquiry;

