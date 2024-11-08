import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { useState } from 'react';
import Auth from './components/auth/Auth';
import MyPosts from './components/MyPosts';
import MyAccount from './components/MyAccount';

function App() {

  const [isUserAuthorized] = useState<boolean>(true)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={isUserAuthorized ? <Home /> : <Auth />}>
          <Route path='/myposts' element={<MyPosts />}/>
          <Route path='/myaccount' element={<MyAccount />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
