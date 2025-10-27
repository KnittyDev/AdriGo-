'use client';

export default function Features() {
  return (
    <main>
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-8 text-center">
              <h1 className="text-3xl font-extrabold tracking-tighter text-text-primary sm:text-4xl md:text-5xl lg:text-6xl px-4">
                Our Core Features
              </h1>
              <p className="mx-auto max-w-3xl text-base sm:text-lg text-text-secondary px-4">
                Discover the elements that make every ride with us a premium, safe, and seamless experience. We've designed our service with your needs in mind.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-2 lg:gap-16">
              <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <span className="material-symbols-outlined !text-5xl">speed</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary">Quick Rides</h3>
                  <p className="mt-2 text-base text-text-secondary">Get to your destination faster than ever. Our intelligent dispatch system connects you with the nearest available driver, while our optimized routing technology navigates through the quickest paths, saving you precious time on every journey.</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <span className="material-symbols-outlined !text-5xl">shield</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary">Safe & Secure</h3>
                  <p className="mt-2 text-base text-text-secondary">Your safety is our top priority. All drivers undergo rigorous background checks and vehicle inspections. Every ride is tracked in real-time, and you can share your trip status with loved ones for added peace of mind.</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <span className="material-symbols-outlined !text-5xl">phone_iphone</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary">Futuristic Interface</h3>
                  <p className="mt-2 text-base text-text-secondary">Experience our sleek, modern, and intuitive app interface. Designed for an effortless booking experience, you can set your destination, see your fare estimate, and book a ride in just a few taps. It's premium transportation at your fingertips.</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <span className="material-symbols-outlined !text-5xl">support_agent</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary">24/7 Support</h3>
                  <p className="mt-2 text-base text-text-secondary">We're here for you, day or night. Our dedicated customer support team is available around the clock to assist you with any questions or concerns. Whether it's a question about a fare or help with a lost item, we're just a message away.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
    </main>
  );
}
