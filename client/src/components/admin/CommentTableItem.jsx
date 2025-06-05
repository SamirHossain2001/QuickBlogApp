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

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blog, createdAt, _id } = comment;
  const blogDate = new Date(createdAt);

  const { axios } = useAppContext();

  const approveComment = async () => {
    try {
      const { data } = await axios.post("/api/admin/approve-comment", {
        id: _id,
      });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteComment = async () => {
    const result = await swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "This comment will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axios.post("/api/admin/delete-comment", {
          id: _id,
        });
        if (data.success) {
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "The comment has been deleted.",
            icon: "success",
          });
          toast.success(data.message);
          fetchComments();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        title: "Cancelled",
        text: "The comment is safe 🙂",
        icon: "error",
      });
    }
  };

  return (
    <tr className="order-y border-gray-300">
      <td className="px-6 py-4">
        <b className="font-medium text-gray-600">Blog</b> : {blog.title}
        <br />
        <br />
        <b className="font-medium text-gray-600">Name</b>: {comment.name}
        <br />
        <b className="font-medium text-gray-600">Comment</b>: {comment.content}
      </td>
      <td className="px-6 py-4 max-sm:hidden">
        {blogDate.toLocaleDateString()}
      </td>
      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-4">
          {!comment.isApproved ? (
            <img
              onClick={approveComment}
              src={assets.tick_icon}
              alt="tick icon"
              className="w-5 hover:scale-110 transition-all cursor-pointer"
            />
          ) : (
            <p className="text-xs border border-green-100 text-green-600 rounded-full px-3 py-1">
              Approved
            </p>
          )}
          <img
            onClick={deleteComment}
            src={assets.bin_icon}
            alt="bin icon"
            className="w-5 hover:scale-110 transition-all cursor-pointer"
          />
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
