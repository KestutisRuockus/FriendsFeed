import { Outlet } from 'react-router-dom'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/footer/Footer'
import FriendsList from '../components/friendsList/FriendsList'

const HomeLayout = () => {
  return (
  <>
    <Navbar />
    <div className='flex flex-col-reverse md:flex-row'>
      <Outlet />
      <FriendsList />
    </div>
    <Footer />
  </>
  )
}

export default HomeLayout