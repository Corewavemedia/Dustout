import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';

const AboutSection = () => {
  return (
    <>
         {/* Hero Section */}
         <section className="relative py-20 bg-gradient-to-b from-sky-50 to-white overflow-hidden">
         {/* Top fade effect for smooth transition */}
       <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-sky-50 to-transparent pointer-events-none"></div>
         {/* Cloud background overlay */}
         <div className="absolute inset-0 z-0">
           <Image
             src="/images/cloudbg.jpg"
             alt="Cloud Background"
             fill
             className="object-cover opacity-10"
             priority
           />
         </div>
         
         {/* Background bubbles */}
        <Image
             src="/images/bubble.png"
             alt="Bubble Large"
             width={600}
             height={600}
             className="absolute -top-[15%] rotate-12 scale-150 transform left-[20%] opacity-60 z-10"
           />
 
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
         {/* Mobile layout - Text first, then images */}
         <div className="md:hidden">
           {/* Text Content at the top for mobile */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="mb-8"
           >
             <div className="text-center font-majer">
               <h1 className="text-green-500 font-semibold text-3xl">About Us</h1>
               <h2 className="text-3xl font-bold text-blue-600 mb-5">
                 Best Cleaning in The UK
               </h2>
             </div>
 
             <div className="grid grid-cols-2 gap-2 mb-6">
               {["Reliable", "Fast", "Thorough", "Affordable"].map(
                 (feature, index) => (
                   <div
                     key={index}
                     className="flex items-center bg-sky-100 rounded-md p-2"
                   >
                     <div className="border border-blue-600 p-1 rounded-md mr-2">
                       <CheckIcon className="h-4 w-4 text-blue-600" />
                     </div>
                     <span className="font-semibold text-blue-600 text-sm">
                       {feature}
                     </span>
                   </div>
                 )
               )}
             </div>
 
             <p className="mb-6 leading-relaxed text-sm font-semibold text-[#777777] text-justify">
               At DustOut, we are the UK&apos;s top cleaning agency, specializing in
               industrial cleaning, residential cleaning, fumigation, and
               landscaping.
               <br />
               <br />
               Our expert team delivers reliable, eco-friendly services that meet
               the highest standards, transforming spaces with precision and
               care. Whether it&apos;s deep cleaning, pest control, or outdoor
               makeovers, DustOut ensures cleaner, healthier, and more beautiful
               environments across the UK.
             </p>
 
             
           </motion.div>
         </div>
 
         {/* Desktop layout - Original side-by-side arrangement */}
         <div className="hidden md:grid md:grid-cols-2 gap-8 items-start lg:px-24">
          {/* Images Column - Left side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-4"
          >
            {/* Top image grid: 2 stacked on left, 1 taller on right */}
            <div className="grid grid-cols-5 gap-4 h-80">
              {/* Left column - Two stacked images */}
              <div className="col-span-2 grid grid-rows-2 gap-4">
                {/* Top left image */}
                <div className="rounded-lg overflow-hidden shadow-md">
                  <div className="relative h-full">
                    <Image
                      src="/images/modern-house.png"
                      alt="Modern House"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Bottom left image */}
                <div className="rounded-lg overflow-hidden shadow-md">
                  <div className="relative h-full">
                    <Image
                      src="/images/worker-cleaning.png"
                      alt="Worker Cleaning"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Right column - Taller image */}
              <div className="col-span-3 rounded-lg overflow-hidden shadow-md">
                <div className="relative h-full">
                  <Image
                    src="/images/men-high-five.png"
                    alt="Team members high-fiving"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Bottom merged images - Two images that appear as one */}
            <div className="rounded-lg overflow-hidden shadow-md h-32 bg-blue-400">
              {/* This is a special case where we visually merge two images */}
              <div className="grid grid-cols-2 h-full">
                <div className="relative h-full">
                  <Image
                    src="/images/cleaning-tools-1.png"
                    alt="Cleaning Tools 1"
                    fill
                    className="object-contain object-center"
                  />
                </div>
                <div className="relative h-full">
                  <Image
                    src="/images/cleaning-tools-2.png"
                    alt="Cleaning Tools 2"
                    fill
                    className="object-contain object-center"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Content - Right side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className=" font-majer">
              <span className="text-green-500 font-medium">About Us</span>
              <h2 className="text-3xl md:text-3xl font-bold text-blue-600 mb-6">
                Best Cleaning in The UK
              </h2>

              <p className="text-[#777777] mb-8 sm:text-sm lg:text-base leading-relaxed font-poppins font-semibold">
                At DustOut, we are the UK&apos;s top cleaning agency, specializing in
                industrial cleaning, residential cleaning, fumigation, and
                landscaping.
                <br />
                <br />
                Our expert team delivers reliable, eco-friendly services that
                meet the highest standards, transforming spaces with precision
                and care. Whether it&apos;s deep cleaning, pest control, or outdoor
                makeovers, DustOut ensures cleaner, healthier, and more
                beautiful environments across the UK.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {["Reliable", "Fast", "Thorough", "Affordable"].map(
                  (feature, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-sky-100 rounded-md p-3"
                    >
                      <div className="p-1.5 border-2 border-blue-600 rounded-md mr-3">
                        <CheckIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-blue-600">
                        {feature}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
       </div>
       </section>
 
             <div className='flex justify-center items-center text-center font-majer'>
                 <h1 className="font-bold leading-tight mb-6">
               <span className="text-4xl sm:text-5xl text-green-500 block">
                 We Clean;
               </span>
               <span className="text-4xl sm:text-5xl text-blue-700 block mt-1">
                 So You Don&apos;t
               </span>
               <span className="text-4xl sm:text-5xl text-blue-700 block mt-1">
                 Have To
               </span>
             </h1>
             </div>
              
              {/* Images below for mobile - simplified layout but keeping the same structure */}
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="flex flex-col gap-3 px-4 md:hidden"
           >
             <div className='pt-16 flex justify-center items-center text-center'>
                 <span className="text-4xl sm:text-5xl text-green-500 font-bold leading-tight block font-majer">
                 Success Story:
               </span>
             </div>
             
             {/* Top image grid: 2 stacked on left, 1 taller on right */}
             <div className="grid grid-cols-5 gap-2 h-64">
               {/* Left column - Two stacked images */}
               <div className="col-span-2 grid grid-rows-2 gap-2">
                 {/* Top left image */}
                 <div className="rounded-lg overflow-hidden shadow-md">
                   <div className="relative h-full">
                     <Image
                       src="/images/modern-house.png"
                       alt="Modern House"
                       fill
                       className="object-cover"
                     />
                   </div>
                 </div>
 
                 {/* Bottom left image */}
                 <div className="rounded-lg overflow-hidden shadow-md">
                   <div className="relative h-full">
                     <Image
                       src="/images/worker-cleaning.png"
                       alt="Worker Cleaning"
                       fill
                       className="object-cover"
                     />
                   </div>
                 </div>
               </div>
 
               {/* Right column - Taller image */}
               <div className="col-span-3 rounded-lg overflow-hidden shadow-md">
                 <div className="relative h-full">
                   <Image
                     src="/images/men-high-five.png"
                     alt="Team members high-fiving"
                     fill
                     className="object-cover"
                   />
                 </div>
               </div>
             </div>
 
             {/* Bottom merged images - Two images that appear as one */}
             <div className="rounded-lg overflow-hidden shadow-md h-24 bg-blue-400">
               <div className="grid grid-cols-2 h-full">
                 <div className="relative h-full">
                   <Image
                     src="/images/cleaning-tools-1.png"
                     alt="Cleaning Tools 1"
                     fill
                     className="object-cover object-center"
                   />
                 </div>
                 <div className="relative h-full">
                   <Image
                     src="/images/cleaning-tools-2.png"
                     alt="Cleaning Tools 2"
                     fill
                     className="object-cover object-center"
                   />
                 </div>
               </div>
             </div>
           </motion.div>
           </>
  )
}

export default AboutSection