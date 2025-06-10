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

interface Service {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  variables: ServiceVariable[];
}

interface ServiceVariable {
  id: string;
  name: string;
  unitPrice: number;
}

interface SelectedServiceVariable {
  variableId: string;
  quantity: number;
}

interface SelectedService {
  serviceId: string;
  serviceName: string;
  variables: SelectedServiceVariable[];
}

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  serviceAddress: string;
  cityState: string;
  postCode: string;
  landmark: string;
  selectedServices: SelectedService[];
  serviceFrequency: string;
  preferredDate: string;
  startTime: string;
  endTime: string;
  urgent: string;
  specialNotes: string;
  estimatedPrice: number;
}

export const useBookingForm = (user?: User | null) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: user?.user_metadata?.full_name || '',
    phone: user?.user_metadata?.phone || '',
    email: user?.email || '',
    serviceAddress: '',
    cityState: '',
    postCode: '',
    landmark: '',
    selectedServices: [],
    serviceFrequency: '',
    preferredDate: '',
    startTime: '',
    endTime: '',
    urgent: '',
    specialNotes: '',
    estimatedPrice: 0
  });

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data.services);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

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

  // Calculate estimated price whenever selected services change
  useEffect(() => {
    const calculatePrice = () => {
      let basePrice = 0;
      
      formData.selectedServices.forEach(selectedService => {
        const service = services.find(s => s.id === selectedService.serviceId);
        if (service) {
          selectedService.variables.forEach(variable => {
            const serviceVariable = service.variables.find(v => v.id === variable.variableId);
            if (serviceVariable) {
              basePrice += serviceVariable.unitPrice * variable.quantity;
            }
          });
        }
      });

      // Apply frequency multiplier
      let frequencyMultiplier = 1;
      switch (formData.serviceFrequency) {
        case 'weekly':
          frequencyMultiplier = 4; // 4 weeks in a month
          break;
        case 'bi-weekly':
          frequencyMultiplier = 2; // 2 times in a month
          break;
        case 'monthly':
          frequencyMultiplier = 12; // 12 months in a year
          break;
        case 'one-time':
        default:
          frequencyMultiplier = 1;
          break;
      }

      const estimatedPrice = basePrice * frequencyMultiplier;
      
      setFormData(prev => ({
        ...prev,
        estimatedPrice
      }));
    };

    calculatePrice();
  }, [formData.selectedServices, formData.serviceFrequency]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addService = (serviceId: string, serviceName: string) => {
    const selectedService: SelectedService = {
      serviceId,
      serviceName,
      variables: []
    };

    setFormData(prev => ({
      ...prev,
      selectedServices: [...prev.selectedServices, selectedService]
    }));
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.filter((_, i) => i !== index)
    }));
  };

  const updateServiceQuantity = (serviceId: string, variableId: string, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.map(selectedService => {
        if (selectedService.serviceId === serviceId) {
          const existingVariableIndex = selectedService.variables.findIndex(v => v.variableId === variableId);
          
          if (existingVariableIndex >= 0) {
            // Update existing variable
            const updatedVariables = [...selectedService.variables];
            updatedVariables[existingVariableIndex] = { variableId, quantity };
            return { ...selectedService, variables: updatedVariables };
          } else {
            // Add new variable
            return {
              ...selectedService,
              variables: [...selectedService.variables, { variableId, quantity }]
            };
          }
        }
        return selectedService;
      })
    }));
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
        services: formData.selectedServices.map(service => ({
          serviceId: service.serviceId,
          variableName: service.serviceName,
          variables: service.variables
        })),
        serviceFrequency: formData.serviceFrequency.trim(),
      };

      if (!requiredFields.fullName || !requiredFields.phone || !requiredFields.email || 
          !requiredFields.serviceAddress || requiredFields.services.length === 0 || 
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
        services: requiredFields.services,
        serviceFrequency: requiredFields.serviceFrequency,
        preferredDate: formData.preferredDate || '',
        startTime: formData.startTime,
        endTime: formData.endTime,
        urgent: formData.urgent || 'No',
        specialNotes: formData.specialNotes.trim() || '',
        estimatedPrice: formData.estimatedPrice
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
          selectedServices: [],
          serviceFrequency: '',
          preferredDate: '',
          startTime: '',
          endTime: '',
          urgent: '',
          specialNotes: '',
          estimatedPrice: 0
        });
        setCurrentStep(1);
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
    setFormData,
    isSubmitting,
    submitMessage,
    services,
    loadingServices,
    handleChange,
    addService,
    removeService,
    updateServiceQuantity,
    nextStep,
    prevStep,
    handleSubmit
  };
};