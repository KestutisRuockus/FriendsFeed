import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Auth from './components/auth/Auth';
import MyPosts from './components/posts/MyPosts';
import MyAccount from './components/myAccount/MyAccount';
import HomeLayout from './layouts/HomeLayout';
import Home from './pages/Home';

function App() {

  const [isUserAuthorized] = useState<boolean>(true)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={isUserAuthorized ? <HomeLayout /> : <Auth />}>
          <Route path='/' element={<Home />}/>
          {/* <Route path='/myposts' element={<MyPosts />}/> */}
          {/* <Route path='/myaccount' element={<MyAccount />}/> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
