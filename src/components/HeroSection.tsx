import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="tw-relative tw-py-24 md:tw-py-32 tw-px-6 tw-overflow-hidden">
      {/* Video background */}
      <div className="tw-absolute tw-inset-0 tw-z-0">
        <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-b tw-from-gray-900/90 tw-to-black/95 tw-z-10"></div>
        <video
          className="tw-absolute tw-inset-0 tw-w-full tw-h-full tw-tw-object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
        >
          <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* Background elements - keeping as a fallback if video doesn't load */}
      <div className="tw-absolute tw-inset-0 tw-z-0 tw-opacity-20">
        <div className="tw-absolute tw-top-20 tw-right-10 tw-w-72 tw-h-72 tw-bg-protega-600 tw-rounded-full tw-filter tw-blur-3xl tw-opacity-20 tw-animate-pulse"></div>
        <div className="tw-absolute tw-bottom-20 tw-left-10 tw-w-72 tw-h-72 tw-bg-cyan-400 tw-rounded-full tw-filter tw-blur-3xl tw-opacity-10 tw-animate-pulse"></div>
      </div>
      
      <div className="tw-container tw-relative tw-mx-auto tw-z-10">
        <motion.div 
          className="tw-max-w-4xl tw-mx-auto tw-text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="tw-inline-block tw-py-1 tw-px-3 tw-rounded-full tw-bg-gradient-to-r tw-from-protega-800 tw-to-protega-700 tw-text-white tw-text-sm tw-font-medium tw-mb-5">
            Powering the future of eCommerce assurance
          </span>
          
          <h1 className="tw-text-4xl md:tw-text-5xl lg:tw-text-6xl tw-font-bold tw-mb-6 tw-bg-gradient-to-r tw-from-white tw-to-gray-300 tw-text-transparent tw-bg-clip-text tw-leading-tight">
            The smartest post-purchase platform driven by AI built for Indian eCommerce
          </h1>
          
          <p className="tw-text-xl tw-text-gray-300 tw-mb-8 tw-max-w-3xl tw-mx-auto">
            Boost your margins, build brand trust, and protect customer happiness — with every shipment and sale.
          </p>
          
          <div className="tw-flex tw-flex-wrap tw-gap-4 tw-justify-center">
            <Link to="/" className="tw-inline-flex tw-items-center tw-px-6 tw-py-3 tw-bg-protega-600 tw-text-white tw-rounded-md hover:tw-bg-protega-700 tw-transition-colors tw-font-medium tw-text-base tw-shadow-lg hover:tw-shadow-protega-500/20">
              Schedule a Demo
              <ArrowRight className="tw-ml-2 tw-h-5 tw-w-5" />
            </Link>
          </div>
          
          <div className="tw-mt-12 tw-flex tw-flex-wrap tw-justify-center tw-gap-6 tw-text-sm tw-text-gray-300">
            <div className="tw-flex tw-items-center">
              <ShieldCheck className="tw-mr-2 tw-h-5 tw-w-5 tw-text-cyan-400" />
              <span>AI-Powered Claims Processed in 90 Seconds</span>
            </div>
            <div className="tw-flex tw-items-center">
              <Truck className="tw-mr-2 tw-h-5 tw-w-5 tw-text-cyan-400" />
              <span>Self-Service Claim Journey for End Customers</span>
            </div>
            <div className="tw-flex tw-items-center">
              <Zap className="tw-mr-2 tw-h-5 tw-w-5 tw-text-cyan-400" />
              <span>Fully Embedded Shopify + WooCommerce SDK</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;