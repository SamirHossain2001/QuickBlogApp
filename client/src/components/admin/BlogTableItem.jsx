import React from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton:
      "bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded",
    cancelButton:
      "bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded",
    actions: "flex gap-3 justify-center",
  },
  buttonsStyling: false,
});

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { title, createdAt } = blog;
  const blogDate = new Date(createdAt);

  const { axios } = useAppContext();

  const deleteBlog = async () => {
    const result = await swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axios.post(`/api/blog/delete`, { id: blog._id });
        if (data.success) {
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your blog has been deleted.",
            icon: "success",
          });
          // toast.success(data.message);
          await fetchBlogs();
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        title: "Cancelled",
        text: "Your blog is safe 🙂",
        icon: "error",
      });
    }
  };

  const togglePublished = async () => {
    try {
      const { data } = await axios.post(`/api/blog/toggle-publish`, {
        id: blog._id,
      });
      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className="border-y border-gray-300 cursor-default">
      <th className="px-2 py-4">{index}</th>
      <td className="px-2 py-4">{title}</td>
      <td className="px-2 py-4 max-sm:hidden">{blogDate.toDateString()}</td>
      <td className="px-2 py-4 max-sm:hidden">
        <p
          className={`${
            blog.isPublished ? "text-green-600" : "text-orange-700"
          }`}>
          {blog.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>
      <td className="px-2 py-4 flex text-xs gap-3">
        <button
          onClick={togglePublished}
          className="border px-2 py-0.5 mt-1 rounded cursor-pointer">
          {blog.isPublished ? "Unpublish" : "Publish"}
        </button>
        <img
          onClick={deleteBlog}
          src={assets.cross_icon}
          alt="cross icon"
          className="w-8 hover:scale-110 transition-all cursor-pointer"
        />
      </td>
    </tr>
  );
};

export default BlogTableItem;
