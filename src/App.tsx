import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Auth from './components/auth/Auth';
import HomeLayout from './layouts/HomeLayout';
import Home from './pages/home/Home';
import { auth } from './firebase/firebaseConfig';
import { User } from 'firebase/auth';
import Profile from './pages/profile/Profile';
import CreatePost from './pages/createPost/CreatePost';

function App() {

  const [authUser, setAuthUser] = useState<User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => setAuthUser(user));
  })

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={authUser ? <HomeLayout /> : <Auth />}>
          <Route index element={<Home />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/createpost' element={<CreatePost />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
