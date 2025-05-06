
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// Create a schema for form validation
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' })
    .refine((email) => {
      // Check if email is from a free email provider
      const freeEmailProviders = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
        'aol.com', 'icloud.com', 'protonmail.com', 'mail.com',
        'zoho.com', 'yandex.com', 'gmx.com'
      ];
      const domain = email.split('@')[1]?.toLowerCase();
      return domain && !freeEmailProviders.includes(domain);
    }, { message: 'Please use your work email address.' }),
  company: z.string().min(1, { message: 'Company name is required.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' })
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      message: ''
    }
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    // Store form submission in local storage as a simple backend alternative
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    const submission = {
      ...data,
      id: Date.now(),
      submittedAt: new Date().toISOString()
    };
    submissions.push(submission);
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    
    // Simulate API call delay
    setTimeout(() => {
      console.log('Form data saved:', data);
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      form.reset();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="glass-card p-6 md:p-8 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </FormLabel>
              <FormControl>
                <Input 
                  className="w-full px-4 py-2.5 dark:text-white text-gray-900 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-protega-500 focus:ring focus:ring-protega-300/50 outline-none transition-all"
                  placeholder="Your full name" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Work Email
              </FormLabel>
              <FormControl>
                <Input 
                  className="w-full px-4 py-2.5 dark:text-white text-gray-900 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-protega-500 focus:ring focus:ring-protega-300/50 outline-none transition-all"
                  placeholder="your.name@company.com" 
                  type="email" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Company
              </FormLabel>
              <FormControl>
                <Input 
                  className="w-full px-4 py-2.5 dark:text-white text-gray-900 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-protega-500 focus:ring focus:ring-protega-300/50 outline-none transition-all"
                  placeholder="Your company name" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </FormLabel>
              <FormControl>
                <Textarea 
                  className="w-full px-4 py-2.5 dark:text-white text-gray-900 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-protega-500 focus:ring focus:ring-protega-300/50 outline-none transition-all resize-none"
                  placeholder="How can we help you?" 
                  rows={4} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full flex items-center justify-center"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              <span>Sending...</span>
            </div>
          ) : (
            <div className="flex items-center">
              <span>Send Message</span>
              <Send size={16} className="ml-2" />
            </div>
          )}
        </button>
      </form>
    </Form>
  );
};

export default ContactForm;
