import Layout from "../common/Layout";
import Sidebar from "./Sidebar";
import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import { useForm } from "react-hook-form";
import axios from "../common/axiosConfig";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateBlog = ({ placeholder }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typings...",
      height: "400px",
    }),
    [placeholder],
  );

  // 🔥 AI GENERATE FUNCTION
  // 🔥 AI GENERATE FUNCTION (Updated)
const generateAIContent = async () => {
  const titleValue = document.querySelector('input[name="title"]').value?.trim();
  const categoryValue = document.querySelector('select[name="category"]').value;

  if (!titleValue || !categoryValue) {
    toast.error("Title aur Category pehle fill karo");
    return;
  }

  try {
    setLoading(true);

    const response = await axios.post("/ai/generate-content", {
      title: titleValue,
      category: categoryValue,
    });

    // response is already the .data because of your axios interceptor
    if (response.success) {
      setContent(response.content || "");
      toast.success("AI content generated successfully 🚀");
    } else {
      toast.error(response.message || "AI failed to generate content");
    }
  } catch (error) {
    console.error("AI Error:", error);
    toast.error("AI failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const onSubmit = async (frmData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", frmData.title);
      formData.append("read_time", frmData.read_time);
      formData.append("category", frmData.category);
      formData.append("content", content);
      formData.append("status", frmData.status);

      if (frmData.image && frmData.image[0]) {
        formData.append("image", frmData.image[0]);
      }

      if (frmData.video && frmData.video[0]) {
        formData.append("video", frmData.video[0]);
      }

      const { data, success, message } = await axios.post(
        "/blogs/create",
        formData,
      );
      if (success) {
        toast.success(message);
        reset();
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

  return (
    <Layout>
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="flex flex-col md:flex-row gap-8">
            <Sidebar />

            <main className="flex-1">
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Create Blog
                  </h3>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5 w-full"
                  >
                    {/* Title */}
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
                        <p className="text-red-400">{errors?.title?.message}</p>
                      )}
                    </div>

                    {/* Category */}
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
                        <p className="text-red-400">
                          {errors?.category?.message}
                        </p>
                      )}
                    </div>

                    {/* 🔥 AI BUTTON */}
                    <div>
                      <button
                        type="button"
                        onClick={generateAIContent}
                        className="mt-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        disabled={loading}
                      >
                        {loading ? "Generating..." : "Generate AI Content 🤖"}
                      </button>
                    </div>

                    {/* Content */}
                    <div>
                      <label className="font-medium text-gray-800 mb-2 block">
                        Content
                      </label>
                      <JoditEditor
                        ref={editor}
                        value={content}
                        config={config}
                        tabIndex={1}
                        onBlur={(newContent) => setContent(newContent)}
                        onChange={() => {}}
                      />
                    </div>

                    {/* Read Time */}
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

                    {/* Image Upload */}
                    <div>
                      <label className="font-medium text-gray-800 mb-2 block">
                        Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        {...register("image")}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>

                    {/* Video Upload */}
                    <div>
                      <label className="font-medium text-gray-800 mb-2 block">
                        Video
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        {...register("video")}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>

                    {/* Status */}
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
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary-color text-white rounded-md hover:bg-blue-600 transition"
                        disabled={loading}
                      >
                        {!loading ? "Create" : "Please wait..."}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateBlog;
