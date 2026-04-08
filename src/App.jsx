import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import Blog from './components/pages/Blog'
import Detail from './components/pages/Detail'
import Login from './components/pages/Login'
import Register from './components/pages/Register'

import Profile from './components/account/Profile'
import MyBlogs from './components/account/MyBlogs'
import FavBlog from './components/account/FavBlog'
import ChangePasword from './components/account/ChangePasword'
import CreateBlog from './components/account/CreateBlog'
import UpdateBlog from './components/account/UpdateBlog'

import { Toaster } from 'react-hot-toast'
import RequireAuth from './components/common/RequireAuth'
import GuestRoute from './components/common/GuestRoute'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/blogs' element={<Blog />} />
          <Route path='/detail/:id' element={<Detail />} />

          {/* Guest Routes */}
          <Route
            path='/login'
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />

          <Route
            path='/register'
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />

          {/* Account Protected Routes */}
          <Route
            path='/account/profile'
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          <Route
            path='/account/my-blogs'
            element={
              <RequireAuth>
                <MyBlogs />
              </RequireAuth>
            }
          />

          <Route
            path='/account/blogs/create'
            element={
              <RequireAuth>
                <CreateBlog />
              </RequireAuth>
            }
          />
          <Route
            path="/account/my-blogs"
            element={<MyBlogs />}
          />

          <Route
            path="/account/saved-blogs"
            element={<FavBlog />}
          />
          <Route
            path='/account/blogs/create'
            element={
              <RequireAuth>
                <CreateBlog />
              </RequireAuth>
            }
          />


          <Route
            path='/account/blogs/:id/edit'
            element={
              <RequireAuth>
                <UpdateBlog />
              </RequireAuth>
            }
          />

          
      

          <Route
            path='/account/saved-blogs'
            element={
              <RequireAuth>
                <FavBlog />
              </RequireAuth>
            }
          />

          <Route
            path='/account/change-password'
            element={
              <RequireAuth>
                <ChangePasword />
              </RequireAuth>
            }
          />

        </Routes>
      </BrowserRouter>

      <Toaster />
    </>
  )
}

export default App