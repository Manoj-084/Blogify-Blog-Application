 export const token =() => {
     const userInfo = localStorage.getItem("mern-blog")
     return userInfo ? JSON.parse(userInfo).token : null
}