'use client';

import { CircularProgress } from '@/components/ui/circular-progress';

export default function DeliveryServices() {
  const ocrText = "We offer fast and reliable delivery services for all our products across the region — a service that our customers truly appreciate, as reflected in positive reviews and analytics feedback. We provide free delivery for all orders above Ksh 5,000 within Eldoret and its surrounding areas. In the rare event that a return is necessary, we do allow goods to be returned provided they meet our return policy requirements. For more details, please refer to our Terms and Conditions document available in the footer. Whether you're ordering electrical fittings, plumbing supplies, lighting solutions, or home décor items, Alpha Electricals & Plumbing Ltd ensures that your purchases are delivered safely and on time. Our goal is to make your shopping experience as convenient and hassle-free as possible.";

  return (
    <section 
        className="relative w-full overflow-hidden bg-cover bg-center bg-fixed py-20 md:py-28"
        style={{ backgroundImage: "url('/delivery teamVan.jpg')" }}
        data-ai-hint="delivery team work"
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Text */}
            <div className="text-white space-y-6 text-center lg:text-left">
                <h2 className="text-3xl font-bold font-headline md:text-4xl">
                    We Also Offer Delivery Services
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-white/90">
                   {ocrText}
                </p>
            </div>
            {/* Right Column: Progress Circles */}
            <div className="relative h-96 lg:h-[450px]">
                 <div className="absolute top-[25%] left-[5%] sm:left-[15%] lg:left-[5%]">
                     <CircularProgress 
                         progress={3} 
                         label="Returned Goods" 
                         size={120} 
                         strokeWidth={8} 
                         progressColor="#f59e0b"
                         trackColor="rgba(255, 255, 255, 0.15)"
                     />
                 </div>
                 <div className="absolute top-0 right-[5%] sm:right-[15%] lg:right-[5%]">
                     <CircularProgress 
                         progress={90} 
                         label="Good User Experience" 
                         size={150} 
                         strokeWidth={9} 
                     />
                 </div>
                 <div className="absolute top-[55%] left-1/2 transform -translate-x-1/2">
                     <CircularProgress 
                         progress={98} 
                         label="Satisfactory Service Delivery" 
                         size={180} 
                         strokeWidth={11} 
                     />
                 </div>
            </div>
        </div>
      </div>
    </section>
  );
}
