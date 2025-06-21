"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

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
  const [submitMessage, setSubmitMessage] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [loadingDates, setLoadingDates] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    fullName: user?.user_metadata?.full_name || "",
    phone: user?.user_metadata?.phone || "",
    email: user?.email || "",
    serviceAddress: "",
    cityState: "",
    postCode: "",
    landmark: "",
    selectedServices: [],
    serviceFrequency: "",
    preferredDate: "",
    startTime: "",
    endTime: "",
    urgent: "",
    specialNotes: "",
    estimatedPrice: 0,
  });

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services");
        if (response.ok) {
          const data = await response.json();
          setServices(data.services);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  // Fetch unavailable dates on component mount
  useEffect(() => {
    const fetchUnavailableDates = async () => {
      try {
        const response = await fetch("/api/unavailable-dates");
        if (response.ok) {
          const dates = await response.json();
          setUnavailableDates(dates);
        }
      } catch (error) {
        console.error("Error fetching unavailable dates:", error);
      } finally {
        setLoadingDates(false);
      }
    };

    fetchUnavailableDates();
  }, []);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.user_metadata?.full_name || prev.fullName,
        phone: user.user_metadata?.phone || prev.phone,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  // Calculate estimated price whenever selected services or frequency change
  useEffect(() => {
    const calculatePrice = () => {
      let basePrice = 0;

      formData.selectedServices.forEach((selectedService) => {
        const service = services.find((s) => s.id === selectedService.serviceId);
        if (service) {
          selectedService.variables.forEach((variable) => {
            const serviceVariable = service.variables.find(
              (v) => v.id === variable.variableId
            );
            if (serviceVariable) {
              basePrice += serviceVariable.unitPrice * variable.quantity;
            }
          });
        }
      });

      // Apply frequency multiplier
      let frequencyMultiplier = 1;
      const frequency = formData.serviceFrequency.toLowerCase();
      switch (frequency) {
        case "weekly":
          frequencyMultiplier = 4; // 4 weeks in a month
          break;
        case "bi-weekly":
          frequencyMultiplier = 2; // 2 times in a month
          break;
        case "monthly":
          frequencyMultiplier = 12; // 12 months in a year
          break;
        case "one-time":
        default:
          frequencyMultiplier = 1;
          break;
      }

      const estimatedPrice = basePrice * frequencyMultiplier;

      setFormData((prev) => ({
        ...prev,
        estimatedPrice,
      }));
    };

    calculatePrice();
  }, [formData.selectedServices, formData.serviceFrequency, services]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addService = (serviceId: string, serviceName: string) => {
    const selectedService: SelectedService = {
      serviceId,
      serviceName,
      variables: [],
    };

    setFormData((prev) => ({
      ...prev,
      selectedServices: [...prev.selectedServices, selectedService],
    }));
  };

  const removeService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.filter((_, i) => i !== index),
    }));
  };

  const updateServiceQuantity = (
    serviceId: string,
    variableId: string,
    quantity: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.map((selectedService) => {
        if (selectedService.serviceId === serviceId) {
          const existingVariableIndex = selectedService.variables.findIndex(
            (v) => v.variableId === variableId
          );

          if (existingVariableIndex >= 0) {
            // Update existing variable
            const updatedVariables = [...selectedService.variables];
            updatedVariables[existingVariableIndex] = { variableId, quantity };
            return { ...selectedService, variables: updatedVariables };
          } else {
            // Add new variable
            return {
              ...selectedService,
              variables: [
                ...selectedService.variables,
                { variableId, quantity },
              ],
            };
          }
        }
        return selectedService;
      }),
    }));
  };

  const nextStep = () => {
    // Validate required fields based on current step before proceeding
    if (currentStep === 1) {
      // Step 1: Validate personal and address information
      if (
        !formData.fullName.trim() ||
        !formData.phone.trim() ||
        !formData.email.trim() ||
        !formData.serviceAddress.trim()
      ) {
        alert('Please fill in all required fields marked with *');
        return;
      }
    } else if (currentStep === 2) {
      // Step 2: Validate service selection, frequency, and schedule
      if (formData.selectedServices.length === 0) {
        alert('Please select at least one service');
        return;
      }
      
      if (!formData.serviceFrequency) {
        alert('Please select a service frequency');
        return;
      }
      
      // Check if each selected service has at least one variable with quantity > 0
      let invalidServices = false;
      formData.selectedServices.forEach(service => {
        const serviceObj = services.find(s => s.id === service.serviceId);
        if (serviceObj && serviceObj.variables.length > 0) {
          const hasValidQuantity = service.variables.some(variable => {
            return variable.quantity > 0;
          });
          if (!hasValidQuantity) {
            invalidServices = true;
          }
        }
      });
      
      if (invalidServices) {
        alert('Each service must have at least one variable with a quantity greater than 0');
        return;
      }
      
      if (!formData.preferredDate || !formData.startTime || !formData.endTime) {
        alert('Please select your preferred date and time');
        return;
      }
    }
    
    // If validation passes, proceed to next step
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Validate required fields
      const requiredFields = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        serviceAddress: formData.serviceAddress.trim(),
        services: formData.selectedServices.map((service) => ({
          serviceId: service.serviceId,
          variableName: service.serviceName,
          variables: service.variables,
        })),
        serviceFrequency: formData.serviceFrequency.trim(),
      };

      if (
        !requiredFields.fullName ||
        !requiredFields.phone ||
        !requiredFields.email ||
        !requiredFields.serviceAddress ||
        requiredFields.services.length === 0 ||
        !requiredFields.serviceFrequency
      ) {
        setSubmitMessage("Please fill in all required fields.");
        setIsSubmitting(false);
        return;
      }

      // Get the current session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setSubmitMessage("Please log in to submit a booking.");
        setIsSubmitting(false);
        return;
      }

      // Prepare booking data for Stripe
      const bookingData = {
        fullName: requiredFields.fullName,
        phone: requiredFields.phone,
        email: requiredFields.email,
        address: requiredFields.serviceAddress,
        city: formData.cityState.trim() || "",
        postcode: formData.postCode.trim() || "",
        landmark: formData.landmark.trim() || "",
        selectedServices: requiredFields.services,
        frequency: requiredFields.serviceFrequency,
        preferredDate: formData.preferredDate || "",
        preferredTime: `${formData.startTime} - ${formData.endTime}`,
        urgent: formData.urgent || "No",
        specialInstructions: formData.specialNotes.trim() || "",
        estimatedPrice: formData.estimatedPrice,
      };

      // Create Stripe checkout session
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ bookingData }),
      });

      const result = await response.json();

      if (response.ok && result.url) {
        // Redirect to Stripe checkout
        window.location.href = result.url;
      } else {
        setSubmitMessage(
          result.error || "Failed to create checkout session. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setSubmitMessage("An error occurred. Please try again.");
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
    unavailableDates,
    loadingDates,
    handleChange,
    addService,
    removeService,
    updateServiceQuantity,
    nextStep,
    prevStep,
    handleSubmit,
  };
};