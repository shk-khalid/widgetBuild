
import React from 'react';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'TechMart',
    role: 'E-commerce',
    avatar: 'TM',
    quote: "Implementing Protega.ai increased our average order value by 14%. Customers love the seamless insurance options at checkout.",
    rating: 5
  },
  {
    id: 2,
    name: 'FinSafe Banking',
    role: 'Fintech',
    avatar: 'FS',
    quote: "The API integration was incredibly smooth. We were able to offer cyber insurance to our customers within a week of signing up.",
    rating: 5
  },
  {
    id: 3,
    name: 'JetTravel',
    role: 'Travel',
    avatar: 'JT',
    quote: "The AI recommendations are spot on. Our customers get exactly the travel insurance they need based on their destinations.",
    rating: 5
  },
  {
    id: 4,
    name: 'LuxuryRetail',
    role: 'Fashion & Luxury',
    avatar: 'LR',
    quote: "Since adding Protega's product protection at checkout, our customer satisfaction scores have increased by 32% and return rates dropped.",
    rating: 5
  },
  {
    id: 5,
    name: 'MobileConnect',
    role: 'Telecom',
    avatar: 'MC',
    quote: "The device protection plans have become a significant revenue stream. The AI accurately identifies which customers are most likely to purchase.",
    rating: 5
  }
];

const Testimonials = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { current } = containerRef;
      const scrollAmount = direction === 'left' 
        ? current.scrollLeft - 320 
        : current.scrollLeft + 320;
      
      current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <button 
          onClick={() => scroll('left')}
          className="bg-protega-800 hover:bg-protega-700 text-white p-2 rounded-full shadow-lg"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
      
      <div 
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory gap-6 pb-6 px-6"
      >
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: testimonial.id * 0.1 }}
            className="flex-shrink-0 w-full md:w-[340px] snap-center"
          >
            <div className="bg-protega-800 rounded-xl p-6 border border-protega-700 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-protega-600 flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-protega-300">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-sm text-protega-200 mb-4 flex-grow">
                "{testimonial.quote}"
              </p>
              <div className="flex text-gold-400">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <button 
          onClick={() => scroll('right')}
          className="bg-protega-800 hover:bg-protega-700 text-white p-2 rounded-full shadow-lg"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Testimonials;
