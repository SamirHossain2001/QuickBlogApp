import React from "react";

const Newsletter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 my-32">
      <h1 className="md:text-4xl text-2xl font-semibold">
        Never Miss a <span className="text-primary">Blog!</span>
      </h1>
      <p className="text-gray-500/70 pb-8 md:text-lg">
        Subscribe to get the latest blog, new tech, and exclusive news.
      </p>
      <form className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
        <input
          type="text"
          placeholder="example@gmail.com"
          required
          className="border border-gray-300 rounded-lg h-full border-r-0 outline-none w-full rounded-r-none px-4 text-gray-500"
        />
        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-primary hover:bg-primary/80 transition-all cursor-pointer rounded-lg rounded-l-none">
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default Newsletter;
