export default function HeroEmail() {
  return (
    <>
      <section class="bg-white dark:bg-gray-900">
        <div class="container px-6 py-16 mx-auto text-center">
          <div class="max-w-lg mx-auto">
            <h1 class="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
              Join Us in Fighting Hunger Together!
            </h1>

            <p class="mt-6 text-gray-500 dark:text-gray-300">
              Your generous donations can make a difference in the lives of
              those in need. Let's work together to provide food and hope to our
              community.
            </p>

            <div class="w-full max-w-sm mx-auto mt-6 bg-transparent border rounded-md dark:border-gray-700 focus-within:border-blue-400 focus-within:ring focus-within:ring-blue-300 dark:focus-within:border-blue-300 focus-within:ring-opacity-40">
              <form class="flex flex-col md:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email address to stay updated"
                  class="flex-1 h-10 px-4 py-2 m-1 text-gray-700 placeholder-gray-400 bg-transparent border-none appearance-none dark:text-gray-200 focus:outline-none focus:placeholder-transparent focus:ring-0"
                />

                <button
                  type="button"
                  class="h-10 w-full text-nowrap px-4 py-2 m-1 text-white transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400"
                >
                  Join Our Mission
                </button>
              </form>
            </div>
          </div>

          <div class="max-w-screen-xl mx-auto mt-20">
            <div class="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
              <div class="flex items-center justify-center col-span-1 md:col-span-2 lg:col-span-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" id="zomato">
  <path fill="#e23744" d="M24.66 0h950.68C988.96 0 1000 11.04 1000 24.66v950.67c0 13.62-11.04 24.66-24.66 24.66H24.66C11.04 1000 0 988.96 0 975.34V24.66C0 11.04 11.04 0 24.66 0z"></path>
  <path fill="#fff" d="m195.21 450.86-.8 25.37-66.15 71.92c27.63 0 45.17-.28 55.26-.84-2.92 13.66-5.31 24.81-7.7 41.53-13.28-1.11-34.01-1.39-54.73-1.39-23.11 0-43.31.28-59.52 1.39l.53-25.64 66.16-71.64c-28.96 0-39.59.28-51.55.56 2.66-12.82 4.52-27.04 6.38-41.26 20.99.84 29.23 1.11 56.59 1.11 25.24.01 39.59-.27 55.53-1.11zm47.03 79.55c0 17.01 5.58 25.65 15.14 25.65 12.76 0 22.85-20.62 22.85-45.71 0-17.28-5.58-25.64-14.88-25.64-12.75-.01-23.11 20.33-23.11 45.7zm86.88-22.11c0 46.27-32.68 84.74-75.99 84.74-38.79 0-58.72-26.48-58.72-61.04 0-45.99 32.95-84.46 75.99-84.46 39.32-.01 58.72 26.47 58.72 60.76zm520.66 22.11c0 17.01 5.58 25.65 15.14 25.65 12.76 0 22.85-20.62 22.85-45.71 0-17.28-5.58-25.64-14.88-25.64-12.74-.01-23.11 20.33-23.11 45.7zm88.66-23.09c0 46.88-33.11 85.85-76.99 85.85-39.3 0-59.49-26.83-59.49-61.85 0-46.59 33.38-85.57 76.99-85.57 39.83.01 59.49 26.84 59.49 61.57zM552.56 492.4c3.46-23.7 1.59-45.16-24.71-45.16-19.13 0-39.85 16.17-54.47 43.2 3.19-22.3 1.33-43.2-24.71-43.2-19.66 0-40.92 17-55.53 45.16 3.72-18.4 2.92-39.3 1.86-43.77-15.14 2.51-28.43 3.9-47.03 4.46.53 12.82-.27 29.55-2.66 45.43l-6.11 41.81c-2.39 16.44-5.05 35.41-7.7 47.39h49.42c.26-7.25 2.12-18.68 3.45-28.72l4.25-28.71c3.45-18.68 18.33-40.7 29.76-40.7 6.64 0 6.38 6.41 4.52 18.4l-4.78 32.33c-2.39 16.44-5.05 35.41-7.7 47.39h49.95c.27-7.25 1.86-18.68 3.19-28.72l4.25-28.71c3.45-18.68 18.33-40.7 29.76-40.7 6.65 0 6.38 6.13 5.31 14.49l-11.93 83.62h45.58l16.03-95.29zm238.68 56.02-5.31 32.9c-8.24 4.46-23.65 10.87-41.45 10.87-30.29 0-36.4-16.16-31.62-50.45l7.7-55.19h-14.9l4.22-35.72 16.27-.79 6.11-25.93 45.96-17.28-5.84 43.21H804c-1.07 4.46-4.78 28.99-5.85 36.51h-30.82l-6.91 51.01c-1.86 13.1-.79 17.84 8.24 17.84 6.64-.01 16.47-3.91 22.58-6.98zm-174.32 15.65c16.72-2.05 28.23-18.18 31-34.27l.47-4.31c-7.19-1.62-17.57-2.84-27.65-1.6-9.59 1.18-17.58 5.16-21.87 10.94-3.23 4.14-4.87 9.1-4.15 15 1.09 8.86 10.89 15.62 22.2 14.24zm-14.25 25.49c-23.6 2.9-39.15-6.47-43.82-27.79-2.94-13.41 1.13-28.68 8.25-37.8 9.52-11.92 25.05-19.58 43.98-21.9 15.24-1.87 28.08-.95 40.09 1.33l.5-2.06c.34-3.29.68-6.58.2-10.53-1.24-10.09-9.22-16.12-28.88-13.7-13.28 1.63-25.91 6.43-35.72 11.89l-9.53-28.83c13.28-7.63 30.04-13.44 49.22-15.79 36.63-4.5 62.36 7.19 65.66 34.03.88 7.14.98 14.72.08 21.58-4.71 33.2-7.72 58.18-9.04 74.94-.2 2.58-.19 7.03.05 13.36l-45.45-.04c.96-2.63 1.83-6.16 2.6-10.61.51-2.93.87-6.63 1.11-11.1-9.64 13.16-22.83 21-39.3 23.02z"></path>
</svg>

              </div>
              <div class="flex items-center justify-center col-span-1 md:col-span-2 lg:col-span-1">
              <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 124 124" viewBox="0 0 124 124" id="swiggy">
  <path fill="#fbbc05" d="M23.1,41.5c0.2-1.2,0.2-2.5,0.4-3.7c1-4.3,2.7-8.4,5.5-11.9c2-2.5,4-5.1,6.4-7.1c2.9-2.3,6.2-4.2,9.4-6
		c4.5-2.6,9.7-3,14.7-3.3c2.6-0.1,5.2,0.6,7.8,1.1c6.2,1.1,11.6,3.9,16.2,8.1c5.7,5.1,9.4,11.6,11.3,19c1,3.5,0.2,5.7-2.7,6.5
		c-3.1,0.8-6.3,1.3-9.5,1.7c-2.6,0.3-5.2,0.3-7.8,0.4c-0.6,0-1.3-0.1-2-0.2c-0.9-0.1-1.9-0.3-2.8-0.3c-1.1-0.1-2.2,0-3.7,0
		c-0.1-3-0.2-5.5-0.3-8.1c0-2,0.2-4-0.1-5.9c-0.1-0.9-1.2-2.2-1.9-2.3c-1.3-0.2-2.2,0.9-2.2,2.4c0,0.2,0,0.4,0,0.5
		c0,4.8,0.1,9.6,0,14.4c-0.1,3.7,0.9,3.9,4.1,4.2c4.2,0.4,8.4,0,12.6,0.1c3.3,0.1,6.6,0.1,9.8,0.7c3,0.6,5.6,3,5.2,5.7
		c-0.3,2.1-0.5,4.2-1.1,6.1c-1,3.1-2.1,6.2-3.5,9.1c-1.7,3.8-3.4,7.7-5.7,11.3c-4.8,7.5-9.8,14.8-15,22c-2.4,3.4-5.4,6.5-8.1,9.7
		c-0.7,0.8-1.2,0.8-1.9-0.2c-3.1-4.4-6.3-8.7-9.6-13c-3.8-5-7.2-10.4-10-16c-1-2.1-0.8-2.5,1.4-3c1.6-0.4,3.3-0.7,5-0.7
		c3.7-0.1,7.4-0.1,11.1,0c1.5,0,2,1,1.9,2.4c-0.1,2-0.1,4.1,0,6.1c0.1,1.3,0.6,2.5,2.1,2.8c1.6,0.3,2.2-0.8,2.6-2.1
		c0.2-0.6,0.3-1.3,0.3-1.9c0-3.1,0-6.1,0-9.2c0-3.3-1-4.3-4.3-4.2c-3.6,0.1-7.1,0.4-10.7,0.5c-3.2,0.1-6.4,0.1-9.5,0
		c-1.5-0.1-3.3-0.3-4.5-1.1c-1.7-1.2-3.3-2.9-4.2-4.8c-4.2-8.1-6.3-16.8-6.8-26" class="colorf0851d svgShape"></path>
</svg>

              </div>
              <div class="flex items-center justify-center col-span-1 md:col-span-2 lg:col-span-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Subway">
  <path fill="#34a853" d="M21.185 4.627 15.488 0v2.347H10.85c-4.325 0-8.35 2.434-8.35 7.037 0 1.983.812 4.377 3.164 5.378h6.841c.149 0 .414-.097.48-.258.118-.288.083-.501-.596-.872-.679-.371-1.425-.662-2.037-.985-.613-.323-2.22-.888-2.22-3.117 0-1.55 1.623-2.632 3.28-2.632h4.075v2.357l5.698-4.628z" class="color0a9b4a svgShape"></path>
  <path fill="#fbbc05" d="M2.633 19.373 8.386 24v-2.347h4.683c4.637 0 8.43-2.434 8.43-7.037 0-2.019-1.176-4.28-3.278-5.378H11.52c-.151 0-.418.097-.485.258-.12.288-.084.501.602.872.686.371 1.424.662 2.043.985s2.25.969 2.25 3.001c0 1.55-1.439 2.748-3.112 2.748H8.386v-2.357l-5.753 4.628z" class="colorffca05 svgShape"></path>
</svg>

              </div>
              <div class="flex items-center justify-center col-span-1 md:col-span-2 lg:col-span-1">
                <img
                  class="h-12"
                  src="https://example.com/partner4-logo.png"
                  alt="Partner 4 Logo"
                />
              </div>
              <div class="flex items-center justify-center col-span-1 md:col-span-2 lg:col-span-1">
                <img
                  class="h-12"
                  src="https://example.com/partner5-logo.png"
                  alt="Partner 5 Logo"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}