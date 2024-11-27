import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Auth from './components/auth/Auth';
import HomeLayout from './layouts/HomeLayout';
import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {

  const [isUserAuthorized, setIsUserAuthorized] = useState<boolean>(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={isUserAuthorized ? <HomeLayout /> : <Auth setIsUserAuthorized={setIsUserAuthorized}/>}>
          <Route index element={<Home />}/>
          <Route path='/profile' element={<Profile />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
