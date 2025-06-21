import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

const AboutSection = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-sky-50 to-white
                         overflow-hidden">
        {/* Top fade effect for smooth transition */}
        <div className="absolute top-0 left-0 right-0 h-32
                        bg-gradient-to-b from-sky-50 to-transparent
                        pointer-events-none" />
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
        {/* Background bubble */}
        <Image
          src="/images/bubble.png"
          alt="Bubble Large"
          width={600}
          height={600}
          className="absolute -top-[15%] rotate-12 scale-150 transform
                     left-[20%] opacity-60 z-10"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                        relative z-10 py-20">
          {/* Mobile layout - text then images */}
          <div className="md:hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="text-center font-majer">
                <h1 className="text-green-500 font-semibold text-3xl">
                  About Us
                </h1>
                <h2 className="text-3xl font-bold text-blue-600 mb-5">
                  Dustout Limited
                </h2>
              </div>
              <p className="mb-6 leading-relaxed text-sm font-semibold
                             text-[#777777] text-justify">
                Dustout Limited is a professional commercial and industrial
                cleaning company committed to excellence, reliability, and high
                standards. We bring a wealth of industry knowledge backed by
                expert training from the British Institute of Cleaning Science
                (BICSc)—the UK&apos;s gold standard for cleaning best practices.
              </p>
              
              <p className="mb-6 leading-relaxed text-sm font-semibold
                             text-[#777777] text-justify">
                This foundation ensures that every cleaning task is performed
                with precision, safety, and professionalism. Whether we&apos;re
                servicing office buildings, industrial facilities, or
                specialized commercial spaces, Dustout Limited delivers
                results you can trust.
              </p>
              <p className="mb-6 leading-relaxed text-sm font-semibold
                             text-[#777777] text-justify">
                We are dedicated to creating clean, healthy, and productive
                environments for every client, with a focus on attention to
                detail, reliability, and customer satisfaction.
              </p>
            </motion.div>
          </div>

          {/* Desktop layout - side-by-side */}
          <div className="hidden md:grid md:grid-cols-2 gap-8 items-start
                          lg:px-24">
            {/* Left—Images */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-5 gap-4 h-80">
                <div className="col-span-2 grid grid-rows-2 gap-4">
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
                <div className="col-span-3 rounded-lg overflow-hidden
                                shadow-md">
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
              <div className="rounded-lg overflow-hidden shadow-md h-32
                              bg-blue-400">
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
            {/* Right—Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="font-majer">
                <span className="text-green-500 font-medium">
                  About Us
                </span>
                <h2 className="text-3xl font-bold text-blue-600 mb-6">
                  Dustout Limited
                </h2>
                <p className="text-[#777777] mb-6 sm:text-sm lg:text-base
                               leading-relaxed font-poppins font-semibold">
                  Dustout Limited is a professional commercial and industrial
                  cleaning company committed to excellence, reliability, and high
                  standards. We bring a wealth of industry knowledge backed by
                  expert training from the British Institute of Cleaning Science
                  (BICSc)—the UK&apos;s gold standard for cleaning best practices.
                </p>
                
                <p className="text-[#777777] mb-6 sm:text-sm lg:text-base
                               leading-relaxed font-poppins font-semibold">
                  This foundation ensures every task is performed with
                  precision, safety, and professionalism. Whether servicing
                  offices, industrial sites, or specialized spaces, Dustout
                  Limited delivers results you can trust.
                </p>
                <p className="text-[#777777] mb-8 sm:text-sm lg:text-base
                               leading-relaxed font-poppins font-semibold">
                  We are dedicated to creating clean, healthy, and productive
                  environments—focused on detail, reliability, and satisfaction.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

      

        {/* Mobile Images */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col gap-3 px-4 md:hidden"
        >
          <div className="pt-16 flex justify-center items-center
                          text-center">
            <span className="text-4xl sm:text-5xl text-green-500
                             font-bold leading-tight block font-majer">
              Success Story:
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2 h-64">
            <div className="col-span-2 grid grid-rows-2 gap-2">
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
            <div className="col-span-3 rounded-lg overflow-hidden
                            shadow-md">
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
          <div className="rounded-lg overflow-hidden shadow-md h-24
                          bg-blue-400">
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
      </section>

      {/* Founder Training & Expertise Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center"
          >
           

            {/* Training Certifications */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-blue-100 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-100 to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>
                
                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-6 font-majer text-center">
                    Our founder has completed comprehensive training in:
                  </h3>
                  
                  <div className="space-y-3">
                    {[
                      "Licence to Practice",
                      "Washroom and Toilet Cleaning",
                      "Kitchen and Food Area Cleaning",
                      "Carpet and Upholstery Cleaning",
                      "Office and Workspace Cleaning",
                      "Safe and Effective Use of Cleaning Equipment"
                    ].map((training, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center group hover:bg-blue-50 rounded-lg p-3 transition-all duration-300"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <CheckIcon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm md:text-base text-[#777777] font-semibold group-hover:text-blue-700 transition-colors duration-300">
                          {training}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-blue-100">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm font-semibold text-blue-600">BICSc Certified</span>
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-blue-600 mb-8
                             font-majer">
                Our Mission
              </h2>
              <div className="bg-sky-100 rounded-2xl p-8 md:p-12">
                <p className="text-lg md:text-xl text-[#777777]
                               leading-relaxed font-poppins font-semibold">
                  To deliver reliable, professional, and high-standard cleaning
                  services that promote healthier, safer, and more productive
                  environments for our clients.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-green-600 mb-8
                             font-majer">
                Our Vision
              </h2>
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg
                              border border-green-100">
                <p className="text-lg md:text-xl text-[#777777]
                               leading-relaxed font-poppins font-semibold">
                  To be a trusted leader in the commercial and industrial
                  cleaning industry, recognized for our commitment to excellence,
                  innovation, and customer satisfaction.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;