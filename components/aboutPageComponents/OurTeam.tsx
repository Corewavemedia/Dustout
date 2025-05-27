import { motion } from 'framer-motion';
import Image from 'next/image';

const OurTeam = () => {
  return (
    <div>
        <section className="py-20 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 py-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-majer text-center text-blue-600 mb-16">
              Our Team
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-32 px-6">
            {[
              {
                name: 'JOHN DOE',
                image: '/images/ourTeam.png',
                description: 'Chief Executive Officer'
              },
              {
                name: 'JOHN DOE',
                image: '/images/ourTeam.png',
                description: 'Chief Executive Officer'
              },
              {
                name: 'JOHN DOE',
                image: '/images/ourTeam.png',
                description: 'Chief Executive Officer'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#D7E8FF69] rounded-2xl pt-16 px-6 pb-6 shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
              >
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-36 h-36 rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain rounded-2xl"
                  />
                </div>
                <div className="mt-8 text-center">
                  <h3 className="text-2xl font-bold text-[#171AD4] ">{item.name}</h3>
                  <p className="text-[#538FDF] leading-relaxed font-majer">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default OurTeam