import React, { useEffect, useState,useRef } from "react";
import Layout from "../common/Layout";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import Sidebar from "./Sidebar";
import axios from "../common/axiosConfig";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";


const Profile = () => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const [loading,setLoding] = useState(false)
    const [profilePic,setProfilePic] = useState(null)
    const getUserInfo = async () => {
        try {
            const { data, message, success } = await axios.get(`/users/fetch-user`)
            if (success) {
                reset({
                    name: data?.user?.name,
                    email: data?.user?.email,
                    bio: data?.user?.bio,
                    location: data?.user?.location,
                })
                setProfilePic(data?.user?.avatar)
            }
        } catch (error) {
            console.log(error || "Something went wrong")
        }
    }

    const updateProfile = async (formData) => {
            //console.log(formData);
            setLoding(true)
             try {
                
            const { data, message, success } = await axios.put("/users/update-profile",formData)
            if (success) {
                reset({
                    name: data?.user?.name,
                    bio: data?.user?.bio,
                    location: data?.user?.location,
                })
                toast.success(message)
            }
        } catch (error) {
            console.log(error || "Something went wrong")
        } finally{
            setLoding(false)
        }
    }
    const inputRef = useRef(null)

    const handleFile = async (e) => {

        try {
            const formData = new FormData()
            formData.append("image", e.target.files[0])
           const {data,message,success} =  await axios.put("/users/update-profile-pic",formData)
           if(success) {
                setProfilePic(data?.url)
                toast.success(message)
                 await getUserInfo()
                
           }
        } catch (error) {
            console.log(error.message || "Something went wrong")
        }
    }

    const handleClick = () => {
        inputRef.current.click()
    }
    useEffect(() => {
        getUserInfo()
    }, [])
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
                                        Profile Information
                                    </h3>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="md:w-1/3">
                                            <div 
                                            onClick={handleClick}
                                            className="aspect-square   w-full max-w-[200px], mx-auto relative">

                                                <input type = "file"
                                                 ref={inputRef}
                                                 onChange={handleFile}
                                                 accept="image/*"
                                                 className="hidden"
                                                />
                                                {
                                                    profilePic && <img
                                                    src={profilePic}
                                                    alt=""
                                                    className="rounded-full w-full h-full object-cover"
                                                />
                                                }
                                                {
                                                    !profilePic && <img
                                                    src={`https://placehold.co/600x400?text=No Image`}
                                                    alt=""
                                                    className="rounded-full w-full h-full object-cover"
                                                />
                                                }

                                                
                                                <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50">
                                                    <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="md:w-2/3 space-y-4">
                                            <form  onSubmit= {handleSubmit(updateProfile)}className="space-y-4">
                                                <div>
                                                    <label
                                                        htmlFor="fullName"
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        Full Name
                                                    </label>
                                                    <input
                                                        {
                                                        ...register("name", {
                                                            required: "The name file is required."
                                                        })
                                                        }
                                                        
                                                        type="text"
                                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                                    focus:outline-none focus:border-primary-color focus:ring-1 focus:ring-primary-color"
                                                        placeholder="Enter your full name"
                                                    />
                                                    {
                                                        errors.name && <p className="text-red-400">{errors.name?.message}</p>
                                                    }
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="email"
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        Email Address
                                                    </label>
                                                    <input
                                                        {
                                                        ...register("email")
                                                        }
                                                        readOnly
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                                    focus:outline-none focus:border-primary-color focus:ring-1 focus:ring-primary-color
                                                    disabled:bg-gray-50 disabled:text-gray-500"
                                                        placeholder="you@example.com"

                                                    />

                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="bio"
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        Bio
                                                    </label>
                                                    <textarea
                                                        {
                                                        ...register("bio")
                                                        }
                                                        id="bio"
                                                        name="bio"
                                                        rows={3}
                                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                                    focus:outline-none focus:border-primary-color focus:ring-1 focus:ring-primary-color"
                                                        placeholder="Write a few sentences about yourself"
                                                    />
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Brief description for
                                                        your profile
                                                    </p>
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="location"
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        Location
                                                    </label>
                                                    <input
                                                        {
                                                        ...register("location",)
                                                        }
                                                        id="location"
                                                        name="location"
                                                        type="text"
                                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                                    focus:outline-none focus:border-primary-color focus:ring-1 focus:ring-primary-color"
                                                        placeholder="City, Country"
                                                    />
                                                </div>
                                                <div className="pt-4">
                                                    <button disabled={loading} className="bg-primary-color text-white px-4 py-2 rounded-md hover:bg-secondary-color focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-offset-2">
                                                        {
                                                            !loading ? "Save Changes" :"Please wait..."
                                                        }
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white shadow rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Account Statistics
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500">
                                                Total Posts
                                            </p>
                                            <p className="text-2xl font-semibold text-gray-900">
                                                24
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500">
                                                Total Comments
                                            </p>
                                            <p className="text-2xl font-semibold text-gray-900">
                                                142
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500">
                                                Joined
                                            </p>
                                            <p className="text-2xl font-semibold text-gray-900">
                                                10,Feb,2026
                                            </p>
                                        </div>
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

export default Profile;