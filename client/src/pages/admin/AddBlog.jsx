import React, { useEffect, useRef, useState } from "react";
import { assets, blogCategories } from "../../assets/assets";
import Quill from "quill";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { parse } from "marked";
import { motion } from "framer-motion";

const AddBlog = () => {
  const { axios } = useAppContext();

  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [isPublished, setIsPublished] = useState(false);

  const toTitleCase = (str) => {
    const minorWords = new Set([
      "a",
      "an",
      "the",
      "and",
      "but",
      "or",
      "nor",
      "for",
      "so",
      "yet",
      "at",
      "by",
      "in",
      "of",
      "on",
      "to",
      "up",
      "per",
      "with",
      "as",
      "over",
      "under",
      "into",
      "onto",
      "upon",
      "from",
      "about",
      "after",
      "around",
      "before",
      "behind",
      "below",
      "beneath",
      "beside",
      "between",
      "beyond",
      "during",
      "inside",
      "near",
      "outside",
      "since",
      "through",
      "throughout",
      "toward",
      "underneath",
      "until",
      "versus",
      "via",
      "within",
      "without",
    ]);

    const words = str.split(" ");
    return words
      .map((originalWord, index) => {
        const lowerWord = originalWord.toLowerCase();
        const isMinor = minorWords.has(lowerWord);
        const isFirstOrLast = index === 0 || index === words.length - 1;

        if (isMinor && !isFirstOrLast) {
          return lowerWord;
        }

        // If the word is already capitalized properly, keep it
        if (originalWord[0] === originalWord[0].toUpperCase()) {
          return originalWord;
        }

        // Capitalize first letter only
        return originalWord.charAt(0).toUpperCase() + originalWord.slice(1);
      })
      .join(" ");
  };

  const generateContent = async () => {
    if (!title) return toast.error("Please enter the title");
    try {
      setLoading(true);
      const { data } = await axios.post("/api/blog/generate", {
        prompt: title,
      });
      if (data.success) {
        quillRef.current.root.innerHTML = parse(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsAdding(true);

      const blog = {
        title: toTitleCase(title),
        subTitle: toTitleCase(subTitle),
        description: quillRef.current.root.innerHTML,
        category,
        isPublished,
      };

      const formData = new FormData();
      formData.append("blog", JSON.stringify(blog));
      formData.append("image", image);

      const { data } = await axios.post(`/api/blog/add`, formData);
      if (data.success) {
        toast.success(data.message);
        setImage(false);
        setTitle("");
        setSubTitle("");
        quillRef.current.root.innerHTML = "";
        setCategory("Startup");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll cursor-default">
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <p>Upload Thumbnail</p>
        <label htmlFor="image">
          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt=""
            className="mt-2 h-16 rounded cursor-pointer"
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </label>

        <p className="mt-4">Blog Title</p>
        <input
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
        />
        <p className="mt-4">Sub Title</p>
        <input
          onChange={(e) => {
            setSubTitle(e.target.value);
          }}
          value={subTitle}
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
        />
        <p className="mt-4">Blog Description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>
          {loading && (
            <div className="absolute right-0 top-0 bottom-0 left-0 flex justify-center items-center bg-black/10 mt-2">
              <div className="w-8 h-8 rounded-full border-2 border-t-white animate-spin"></div>
            </div>
          )}
          <motion.button
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 8px rgba(59,130,246,0.5)",
              transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="button"
            onClick={generateContent}
            className={`absolute bottom-1 right-2 ml-2 text-xs font-semibold text-white px-4 py-2 rounded-full
              bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-500
              hover:from-cyan-400 hover:to-indigo-600 transition-all duration-300
              ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "shadow-md hover:shadow-xl"
              }
            `}>
            {loading ? "Generating..." : "✨ Generate with AI"}
          </motion.button>
        </div>

        <p className="mt-4">Blog Category</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          name="category"
          className="mt-2 px-5 py-2 border text-gray-500 border-gray-300 outline-none rounded">
          <option value="">Select category</option>
          {blogCategories.map((item, index) => {
            return (
              <option key={index} value={item} className="">
                {item}
              </option>
            );
          })}
        </select>
        <div className="flex gap-2 mt-4">
          <p>Publish Now</p>
          <input
            onChange={(e) => setIsPublished(e.target.checked)}
            type="checkbox"
            checked={isPublished}
            className="scale-125 cursor-pointer"
          />
        </div>
        <button
          disabled={isAdding}
          type="submit"
          className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm">
          {isAdding ? "Adding..." : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
