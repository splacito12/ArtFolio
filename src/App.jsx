import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import {useUser} from './User.jsx'
import FrontPage from './pages/FrontPage.jsx'
import Feed from './pages/Feed'
import CreatePost from './pages/CreatePost'
import PostDetail from './pages/PostDetail'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Account from './pages/Account'


import './App.css'

function ProtectedRoute({ children }) {
  const {session, loading} = useUser()

  if(loading) {
    return <p>Loading...</p>
  }

 return session ? children: <Navigate to='/login' />
}

function App() {

  return (
    <Routes>
      <Route path="/" element={<FrontPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
      <Route path="/post/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
      <Route path="/post/:id/edit" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
    </Routes>
      
  )
}

export default App
