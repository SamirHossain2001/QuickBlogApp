import React, { useRef } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Header = () => {
  const { setInput, input } = useAppContext();
  const inputRef = useRef();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setInput(inputRef.current.value);
  };

  const onClear = () => {
    setInput("");
    inputRef.current.value = "";
  };

  return (
    <div className="mx-8 sm:mx-16 xl:mx-24 relative">
      <div className="text-center mt-10 md:mt-20 mb-4 md:mb-8">
        <div className="inline-flex items-center justify-center gap-4 px-6 py-2 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm text-primary cursor-pointer transition-shadow duration-300 hover:shadow-[0_0_20px_4px] hover:shadow-primary/70">
          <p>New: AI feature integrated</p>
          <img src={assets.star_icon} alt="star_icon" className="w-2.5" />
        </div>

        <h1 className="text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700">
          Your Own <span className="text-primary">Blogging</span> <br />
          Platform
        </h1>
        <p className="my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500">
          This is your space to think out loud, to share what matters, and to
          write without filters. Whether it’s one word or a thousand, your story
          starts right here.
        </p>

        {/* Search bar */}
        <form
          onSubmit={onSubmitHandler}
          className="flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-300 bg-white rounded-lg overflow-hidden">
          <input
            type="text"
            ref={inputRef}
            placeholder="Search for blogs"
            required
            className="w-full pl-4 outline-none text-gray-600"
          />
          <button
            type="submit"
            className="bg-primary text-white px-8 py-2 m-1.5 rounded-lg hover:scale-105 hover:bg-primary/80 transition-all duration-300 transform cursor-pointer">
            Search
          </button>
        </form>
      </div>
      <div className="text-center">
        {input && (
          <button
            onClick={onClear}
            className="border border-primary text-primary bg-primary/10 font-semibold text-xs py-1 px-3 rounded shadow-sm cursor-pointer">
            Clear Search
          </button>
        )}
      </div>
      <img
        src={assets.gradientBackground}
        alt="gradientBackground"
        className="absolute -top-50 -z-1 opacity-50"
      />
    </div>
  );
};

export default Header;
