'use client';

export default function ContactPage() {
  return (
    <main>
        {/* Contact Form Section */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-12">
              <div className="flex flex-col gap-4 text-center">
                <h1 className="text-3xl font-extrabold tracking-tighter text-text-primary sm:text-4xl md:text-5xl lg:text-6xl px-4">
                  Get in Touch
                </h1>
                <h2 className="mx-auto max-w-2xl text-base sm:text-lg font-normal text-text-secondary px-4">
                  We're here to help. Fill out the form below or use one of our alternative contact methods to reach us.
                </h2>
              </div>
              <div className="w-full max-w-3xl rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                <form className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-text-primary" htmlFor="name">Name</label>
                    <input 
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-3 py-2" 
                      id="name" 
                      placeholder="Jane Doe" 
                      type="text"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-text-primary" htmlFor="email">Email</label>
                    <input 
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-3 py-2" 
                      id="email" 
                      placeholder="jane.doe@example.com" 
                      type="email"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-text-primary" htmlFor="subject">Subject</label>
                    <input 
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-3 py-2" 
                      id="subject" 
                      placeholder="How can we help?" 
                      type="text"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-text-primary" htmlFor="message">Message</label>
                    <textarea 
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-3 py-2" 
                      id="message" 
                      placeholder="Your message..." 
                      rows={4}
                    ></textarea>
                  </div>
                  <div className="sm:col-span-2">
                    <button 
                      className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-text-primary text-white text-base font-bold transition-all hover:shadow-lg hover:-translate-y-1" 
                      type="submit"
                    >
                      <span className="truncate">Send Message</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Alternative Contact Methods & FAQ Section */}
        <section className="border-t border-gray-100 bg-background-light py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
              <div className="flex flex-col gap-4 lg:col-span-1">
                <h3 className="text-2xl font-bold tracking-tighter text-text-primary">Alternative Methods</h3>
                <p className="text-text-secondary">If you prefer not to use the form, you can reach us through these channels.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                      <span className="material-symbols-outlined">email</span>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">Email</p>
                      <a className="text-sm text-text-secondary hover:text-primary" href="mailto:support@adrigo.com">support@adrigo.com</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                      <span className="material-symbols-outlined">call</span>
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">Phone</p>
                      <a className="text-sm text-text-secondary hover:text-primary" href="tel:+382-20-123-456">+382 (20) 123-456</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <h3 className="mb-6 text-2xl font-bold tracking-tighter text-text-primary">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-text-primary">How do I reset my password?</h4>
                    <p className="text-text-secondary">You can reset your password by tapping the "Forgot Password" link on the login screen of the app.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary">How is my fare calculated?</h4>
                    <p className="text-text-secondary">Fares are based on distance, time, and current demand. You can view our detailed Pricing page for more information.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary">Can I schedule a ride in advance?</h4>
                    <p className="text-text-secondary">Yes, our app allows you to schedule a ride up to 30 days in advance for your convenience.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary">What areas do you serve in Montenegro?</h4>
                    <p className="text-text-secondary">We currently serve Podgorica, Budva, Kotor, Cetinje, Herceg Novi, Ulcinj, and Bar with plans to expand to more cities.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary">How do I become a driver?</h4>
                    <p className="text-text-secondary">Visit our driver application page or contact us directly to learn about driver requirements and the application process.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </main>
  );
}
