'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber } from 'react-phone-number-input';

const cities = [
  'Podgorica',
  'Budva',
  'Kotor',
  'Tivat',
  'Herceg Novi',
  'Ulcinj',
  'Bar',
  'Cetinje',
  'Nikšić',
  'Pljevlja',
  'Bijelo Polje',
  'Berane',
  'Rožaje',
  'Žabljak',
  'Kolašin'
];

export default function DriverApplication() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    vehicleName: '',
    vehicleBrand: '',
    vehiclePlate: '',
    vehicleColor: '',
    city: '',
    birthDate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.vehicleName || 
        !formData.vehicleBrand || !formData.vehiclePlate || !formData.vehicleColor || 
        !formData.city || !formData.birthDate) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Phone validation
    if (!formData.phoneNumber || !isValidPhoneNumber(formData.phoneNumber)) {
      toast.error('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    const loadingToast = toast.loading('Submitting application...');

    try {
      // Save to Supabase
      const { data, error } = await supabase
        .from('driver_applications')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone_number: formData.phoneNumber,
            birth_date: formData.birthDate,
            city: formData.city,
            vehicle_brand: formData.vehicleBrand,
            vehicle_model: formData.vehicleName,
            vehicle_plate: formData.vehiclePlate.toUpperCase(),
            vehicle_color: formData.vehicleColor,
            status: 'pending'
          }
        ])
        .select();

      if (error) {
        console.error('Error submitting application:', error);
        toast.error('Failed to submit application. Please try again.', { id: loadingToast });
        return;
      }

      toast.success('Application submitted successfully! Redirecting...', { id: loadingToast, duration: 2000 });
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        vehicleName: '',
        vehicleBrand: '',
        vehiclePlate: '',
        vehicleColor: '',
        city: '',
        birthDate: ''
      });

      // Redirect to success page after a short delay
      setTimeout(() => {
        router.push(`/driver/success?name=${encodeURIComponent(formData.fullName)}`);
      }, 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* Page Heading */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="flex flex-col gap-4 max-w-3xl">
              <h1 className="text-3xl font-extrabold tracking-tighter text-text-primary sm:text-4xl md:text-5xl lg:text-6xl px-4">
                Become a Driver
              </h1>
              <p className="mx-auto max-w-2xl text-base sm:text-lg font-normal text-text-secondary px-4">
                Join our team of professional drivers and start earning with AdriGo+. Fill out the form below to get started.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-8 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-text-primary mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-4 py-3 text-base"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-4 py-3 text-base"
                  placeholder="john.doe@example.com"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-text-primary mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  international
                  defaultCountry="ME"
                  value={formData.phoneNumber}
                  onChange={(value) => setFormData(prev => ({ ...prev, phoneNumber: value || '' }))}
                  className="phone-input-wrapper"
                  placeholder="Enter phone number"
                />
                <p className="mt-1 text-xs text-text-secondary">Select your country and enter your phone number</p>
              </div>

              {/* Birth Date */}
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-text-primary mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  required
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-4 py-3 text-base"
                />
                <p className="mt-1 text-xs text-text-secondary">You must be at least 18 years old</p>
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-text-primary mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-4 py-3 text-base bg-white"
                >
                  <option value="">Select your city</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vehicle Information Section */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-bold text-text-primary mb-4">Vehicle Information</h3>
                
                {/* Vehicle Brand */}
                <div className="mb-6">
                  <label htmlFor="vehicleBrand" className="block text-sm font-medium text-text-primary mb-2">
                    Vehicle Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="vehicleBrand"
                    name="vehicleBrand"
                    value={formData.vehicleBrand}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-4 py-3 text-base"
                    placeholder="Toyota, Mercedes, BMW, etc."
                  />
                </div>

                {/* Vehicle Name/Model */}
                <div className="mb-6">
                  <label htmlFor="vehicleName" className="block text-sm font-medium text-text-primary mb-2">
                    Vehicle Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="vehicleName"
                    name="vehicleName"
                    value={formData.vehicleName}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-4 py-3 text-base"
                    placeholder="Camry, E-Class, 3 Series, etc."
                  />
                </div>

                {/* Vehicle Plate Number */}
                <div className="mb-6">
                  <label htmlFor="vehiclePlate" className="block text-sm font-medium text-text-primary mb-2">
                    License Plate Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="vehiclePlate"
                    name="vehiclePlate"
                    value={formData.vehiclePlate}
                    onChange={handleInputChange}
                    required
                    maxLength={10}
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-4 py-3 text-base uppercase"
                    placeholder="AB 123-CD"
                  />
                </div>

                {/* Vehicle Color */}
                <div>
                  <label htmlFor="vehicleColor" className="block text-sm font-medium text-text-primary mb-2">
                    Vehicle Color <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="vehicleColor"
                    name="vehicleColor"
                    value={formData.vehicleColor}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-4 py-3 text-base"
                    placeholder="Black, White, Silver, etc."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white text-base font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin mr-2">refresh</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined mr-2">send</span>
                      Submit Application
                    </>
                  )}
                </button>
              </div>

              {/* Terms Notice */}
              <p className="text-xs text-text-secondary text-center">
                By submitting this application, you agree to our Terms of Service and Privacy Policy. 
                We will review your application and contact you within 2-3 business days.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
