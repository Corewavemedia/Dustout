'use client';

const TestimonialSection = () => {
  const testimonials = [
    {
      text: "They are the best firm in the UK and they clean proficiently",
      author: "Sarah Johnson",
      role: "Homeowner"
    },
    {
      text: "They are the best firm in the UK and they clean proficiently",
      author: "Michael Chen",
      role: "Factory Manager"
    },
    {
      text: "They are the best firm in the UK and they clean proficiently",
      author: "Emma Williams",
      role: "Office Manager"
    }
  ];

  return (
    <>
      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
          <div className="absolute top-0 right-0 w-full h-full bg-contain bg-no-repeat bg-right" 
               style={{ backgroundImage: "url('/images/bubble.png')" }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl text-blue-600 font-majer font-bold mb-4">What our clients are saying</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-10 px-14">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#D7E8FF] p-6 rounded-xl shadow-sm flex items-center flex-col md:flex-row relative pt-10 space-x-3"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-md mr-4 flex items-center justify-center text-white font-bold absolute -top-6 left-1/2 md:top-10 md:left-0 transform -translate-x-1/2">
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M28 3.5C22.2031 3.5 17.5 8.20312 17.5 14C17.5 19.7969 22.2031 24.5 28 24.5C33.7969 24.5 38.5 19.7969 38.5 14C38.5 8.20312 33.7969 3.5 28 3.5ZM22.75 28C14.0273 28 7 35.0273 7 43.75V45.5C7 49.3828 10.1172 52.5 14 52.5H42C45.8828 52.5 49 49.3828 49 45.5V43.75C49 35.0273 41.9727 28 33.25 28H22.75Z" fill="white"/>
                    </svg>
                </div>
                <p className="text-blue-700 font-semibold text-center md:text-left">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialSection;
