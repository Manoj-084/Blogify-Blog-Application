import React,{useContext, useState} from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "../common/axiosConfig";
import toast from "react-hot-toast";
import { AuthContext } from "../context/Auth";


const Login = () => {
    const {login} = useContext(AuthContext)
    const{register,handleSubmit,formState:{errors},watch} = useForm()
    const navigate =useNavigate()
    const [loading,setLoading]=useState(false)


            const onSubmit= async (formdata)=>{
                setLoading(true)
                try {
                    const {data,success,message} =  await axios.post("/users/login",formdata)
                    
                    if(success){
                        const userInfo = {
                            token: data.accessToken
                        }
                        localStorage.setItem("mern-blog",JSON.stringify(userInfo))
                        login(userInfo)
                        toast.success(message)
                        navigate('/account/profile')
                    }
                } catch (error) {
                    const message = error.response?.data?.message || "Something went wrong";
                    toast.error(message)
                } finally {
                            setLoading(false)
                }
            }


    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-600 mb-2"
                            htmlFor=""
                        >
                            Email
                        </label>
                        <input
                            
                                 {
                                    ...register('email', {
                                        required: "The email field is required",
                                        pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                        }
                                    })
                                    }

                            
                            placeholder="Enter Email"
                            type="text"
                            className= {`w-full border border-gray-200 py-2 px-4 rounded-lg
                                  focus:outline-none ${errors.email && "border-red-400"}`}
                        />
                        {
                            errors.email && <p className="text-red-400">{errors.email?.message}</p>
                        }
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-600 mb-2"
                            htmlFor=""
                        >
                            Password
                        </label>
                        <input
                         {
                            ...register("password",{
                                required:"The password field is required.",
                                
                            })
                        }
                            placeholder="Enter Password"
                            type="password"
                            className= {`w-full border border-gray-200 py-2 px-4 rounded-lg
                                  focus:outline-none ${errors.password && "border-red-400"}`}
                        />
                        {
                            errors.password && <p className="text-red-400">{errors.password?.message}</p>
                        }
                    </div>
                    <button
                    disabled={loading}
                    className="focus:outline-none w-full text-white bg-primary-color py-2 px-4 rounded-lg hover:bg-secondary-color transition">
                       {
                            !loading ? 'login' :"Please wait..."
                       } 
                    </button>
                </form>
                <p className="text-center text-md text-gray-600 mt-6">
                    Don't have an account?{" "}
                    <Link
                        to={`/register`}
                        className="text-md text-primary-color hover:underline font-medium"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;