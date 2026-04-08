
import React, { useState, useEffect, useContext } from "react";
import Layout from "../common/Layout";
import { useParams, useNavigate } from "react-router-dom";
import {
  HeartIcon,
  ShareIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import axios from "../common/axiosConfig";
import moment from "moment";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AuthContext } from "../context/Auth";

const Detail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const getBlog = async () => {
    try {
      const { data, success } = await axios.get(`/blogs/${params.id}/get-blog-front`);
      if (success) {
        setBlog(data?.blog);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async () => {
    try {
      const { data, success } = await axios.get(`/blogs/get-comments/${params.id}`);
      if (success) {
        setComments(data?.comments || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async (formData) => {
    try {
      if (!isLoggedIn()) {
        navigate("/login");
        return;
      }
      formData.id = params.id;
      const { data, success, message } = await axios.post("/blogs/add-comment", formData);

      if (success) {
        setComments([...comments, data.comment]);
        reset();
        toast.success(message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to post comment");
    }
  };

  const toggleFavorite = async () => {
    try {
      const { data, success, message } = await axios.post("/blogs/add-to-favourite", {
        blogId: params.id,
      });
      if (success) {
        toast.success(message);
        setIsFavorite(data.isFavourite);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBlog();
    getComments();
  }, [params.id]);

  if (!blog) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  // ✅ Improved Video Component
  const renderVideo = () => {
    if (!blog.video) return null;

    // Cloudinary URL already full https link thiba (secure_url)
    const videoUrl = blog.video.startsWith("http") 
      ? blog.video 
      : `http://localhost:8000${blog.video}`;

    console.log("Playing Video:", videoUrl); // Debug pain

    return (
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Video</h3>
        <video 
          className="w-full rounded-xl shadow-lg" 
          controls 
          controlsList="nodownload"
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  return (
    <Layout>
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 group"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Back to articles</span>
          </button>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {blog?.user?.avatar ? (
                  <img
                    src={blog.user.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <img
                    src="https://placehold.co/600x400?text=No+Image"
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}

                <div>
                  <h3 className="font-medium text-gray-900">{blog?.user?.name}</h3>
                  <div className="text-sm text-gray-500">
                    <span>{moment(blog.createdAt).format("DD MMM YYYY")}</span>
                    <span className="mx-2">•</span>
                    <span>{blog.read_time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleFavorite}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {isFavorite ? (
                    <HeartIconSolid className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-gray-600" />
                  )}
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ShareIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
          </header>

          {/* Image */}
          {blog.image && (
            <div className="mb-8">
              <img
                src={blog.image}
                alt={blog.title}
                className="rounded-xl w-full object-cover"
              />
            </div>
          )}

          {/* ✅ Improved Video Section */}
          {renderVideo()}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Comments Section */}
          <section className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-semibold mb-8">
              Comments ({comments.length})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleSubmit(addComment)} className="mb-12">
              <textarea
                {...register("comment", { required: "Comment is required" })}
                placeholder="Add a comment..."
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-primary-color resize-none h-32"
              />
              {errors.comment && (
                <p className="text-red-400 mt-1">{errors.comment.message}</p>
              )}
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-color text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Post Comment
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-8">
              {comments.map((comment) => (
                <div key={comment._id} className="flex space-x-4">
                  {comment?.user?.avatar ? (
                    <img
                      src={comment.user.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src="https://placehold.co/600x400?text=No+Image"
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">
                        {comment.user.name}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {moment(comment.createdAt).format("DD MMM YYYY")}
                      </span>
                    </div>
                    <p className="text-gray-600">{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>
    </Layout>
  );
};

export default Detail;