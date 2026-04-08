import Layout from "../common/Layout";
import Sidebar from "./Sidebar";
import React, { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import { useForm } from "react-hook-form";
import axios from "../common/axiosConfig";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const UpdateBlog = ({ placeholder }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState({});

  const editor = useRef(null);
  const [content, setContent] = useState("");
  const params = useParams();

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || "",
      height: "400px",
    }),
    [placeholder],
  );

  const onSubmit = async (frmData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", frmData.title);
      formData.append("read_time", frmData.read_time);
      formData.append("category", frmData.category);
      formData.append("content", content);
      formData.append("status", frmData.status);

      formData.append("image", frmData.image[0]);

      if (frmData.video && frmData.video[0]) {
        formData.append("video", frmData.video[0]);
      }

      const { data, success, message } = await axios.put(
        `/blogs/${params.id}/update`,
        formData,
      );
      if (success) {
        toast.success(message);
        navigate("/account/my-blogs");
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  const getBlog = async () => {
    try {
      const { data, success, message } = await axios.get(
        `/blogs/${params.id}/get-blog`,
      );

      if (success) {
        const blogData = data.blog;

        reset({
          title: blogData.title,
          read_time: blogData.read_time,
          category: blogData.category?.toLowerCase(),
          status: blogData.status,
        });

        setContent(blogData.content);
        setBlog(blogData);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getBlog();
  }, []);
  return (
    <Layout>
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-[1440px],">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1">
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Create Blog
                  </h3>
                  <div className="flex flex-col md:flex-row gap-6">
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-5 w-full"
                    >
                      <div>
                        <label className="font-medium text-gray-800 mb-2 block">
                          Title
                        </label>
                        <input
                          type="text"
                          {...register("title", {
                            required: "The title field is required.",
                          })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Title"
                        />

                        {errors.title && (
                          <p className="text-red-400 font-medium">
                            {errors?.title?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="font-medium text-gray-800 mb-2 block">
                          Category
                        </label>

                        <select
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          {...register("category", {
                            required: "The category field is required.",
                          })}
                        >
                          <option value="">Select a Category</option>
                          <option value="education">Education</option>
                          <option value="business">Business</option>
                          <option value="technology">Technology</option>
                          <option value="fashion">Fashion</option>
                          <option value="travel">Travel</option>
                        </select>
                        {errors.category && (
                          <p className="text-red-400 font-medium">
                            {errors?.category?.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="font-medium text-gray-800 mb-2 block">
                          Content
                        </label>
                        <JoditEditor
                          ref={editor}
                          value={content}
                          config={config}
                          tabIndex={1} // tabIndex of textarea
                          onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                          onChange={(newContent) => {}}
                        />
                      </div>

                      <div>
                        <label className="font-medium text-gray-800 mb-2 block">
                          Read Time
                        </label>
                        <input
                          type="text"
                          {...register("read_time")}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Read Time"
                        />
                      </div>

                      <div>
                        <label className="font-medium text-gray-800 mb-2 block">
                          Image
                        </label>
                        <input
                          type="file"
                          {...register("image")}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Read Time"
                        />
                        {blog && blog.image && (
                          <img
                            src={`${blog.image}`}
                            alt=""
                            className="w-50 mt-5 rounded"
                          />
                        )}
                      </div>
                      <div>
                       
                        
                        <div>
                           <label className="font-medium text-gray-800 mb-2 block">
                          Video
                        </label>

                          <input
                            type="file"
                            accept="video/*"
                            {...register("video")} // 👈 MUST
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                        {blog && blog.video && (
                          <video className="w-50 mt-5 rounded" controls>
                            <source src={blog.video} type="video/mp4" />
                          </video>
                        )}
                      </div>
                      <div>
                        <label className="font-medium text-gray-800 mb-2 block">
                          Status
                        </label>

                        <select
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          {...register("status")}
                        >
                          <option value="active">Active</option>
                          <option value="block">Block</option>
                        </select>
                        <div className="pt-4">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-primary-color text-white rounded-md hover:bg-blue-600 transition"
                            disabled={loading}
                          >
                            {!loading ? "Update" : "Please wait..."}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateBlog;
