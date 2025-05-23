import React from 'react';

interface BookingStepIconProps {
  number: number;
  className?: string;
}

const BookingStepIcon: React.FC<BookingStepIconProps> = ({ number, className }) => {
  return (
    <div className={`flex items-center justify-center rounded-full bg-blue-600 text-white w-10 h-10 font-bold ${className}`}>
      {number}
    </div>
  );
};

export default BookingStepIcon; 