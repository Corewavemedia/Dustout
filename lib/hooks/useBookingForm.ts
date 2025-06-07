import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    phone?: string;
  };
}

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  serviceAddress: string;
  cityState: string;
  postCode: string;
  landmark: string;
  serviceTypes: string[];
  serviceFrequency: string;
  bedrooms: string;
  bathrooms: string;
  preferredDate: string;
  startTime: string;
  endTime: string;
  urgent: string;
  specialNotes: string;
}

export const useBookingForm = (user?: User | null) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    fullName: user?.user_metadata?.full_name || '',
    phone: user?.user_metadata?.phone || '',
    email: user?.email || '',
    serviceAddress: '',
    cityState: '',
    postCode: '',
    landmark: '',
    serviceTypes: [],
    serviceFrequency: '',
    bedrooms: '',
    bathrooms: '',
    preferredDate: '',
    startTime: '',
    endTime: '',
    urgent: '',
    specialNotes: ''
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.user_metadata?.full_name || prev.fullName,
        phone: user.user_metadata?.phone || prev.phone,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        serviceTypes: checked
          ? [...prev.serviceTypes, value]
          : prev.serviceTypes.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Validate required fields
      const requiredFields = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        serviceAddress: formData.serviceAddress.trim(),
        serviceTypes: formData.serviceTypes,
        serviceFrequency: formData.serviceFrequency.trim(),
      };

      if (!requiredFields.fullName || !requiredFields.phone || !requiredFields.email || 
          !requiredFields.serviceAddress || requiredFields.serviceTypes.length === 0 || 
          !requiredFields.serviceFrequency) {
        setSubmitMessage('Please fill in all required fields.');
        setIsSubmitting(false);
        return;
      }

      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setSubmitMessage('Please log in to submit a booking.');
        setIsSubmitting(false);
        return;
      }

      // Prepare booking data
      const bookingData = {
        fullName: requiredFields.fullName,
        phone: requiredFields.phone,
        email: requiredFields.email,
        serviceAddress: requiredFields.serviceAddress,
        cityState: formData.cityState.trim() || '',
        postCode: formData.postCode.trim() || '',
        landmark: formData.landmark.trim() || '',
        serviceTypes: requiredFields.serviceTypes,
        serviceFrequency: requiredFields.serviceFrequency,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        preferredDate: formData.preferredDate || '',
        startTime: formData.startTime,
        endTime: formData.endTime,
        urgent: formData.urgent || 'No',
        specialNotes: formData.specialNotes.trim() || '',
      };

      // Submit to the bookings API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage('Booking submitted successfully! We will contact you soon.');
        // Reset form
        setFormData({
          fullName: user?.user_metadata?.full_name || '',
          phone: user?.user_metadata?.phone || '',
          email: user?.email || '',
          serviceAddress: '',
          cityState: '',
          postCode: '',
          landmark: '',
          serviceTypes: [],
          serviceFrequency: '',
          bedrooms: '',
          bathrooms: '',
          preferredDate: '',
          startTime: '',
          endTime: '',
          urgent: '',
          specialNotes: ''
        });
        setCurrentStep(2);
      } else {
        setSubmitMessage(result.error || 'Failed to submit booking. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    formData,
    isSubmitting,
    submitMessage,
    handleChange,
    nextStep,
    prevStep,
    handleSubmit
  };
};