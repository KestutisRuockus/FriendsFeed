import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { useState } from 'react';
import Auth from './components/auth/Auth';

function App() {

  const [isUserAuthorized] = useState<boolean>(false)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={isUserAuthorized ? <Home /> : <Auth />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
