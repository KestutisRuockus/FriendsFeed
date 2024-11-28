import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Auth from './components/auth/Auth';
import HomeLayout from './layouts/HomeLayout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import { auth } from './firebase/firebaseConfig';
import { User } from 'firebase/auth';

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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
