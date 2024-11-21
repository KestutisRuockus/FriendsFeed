import { useEffect, useState } from 'react';
import { ProfileProps } from './types'
import Female from '../assets/female.png';
import Male from '../assets/male.png'
import Other from '../assets/other.png'
import Post from '../components/posts/Post';

const person = {
  name: 'John Doe',
  email: 'john.doe@gmail.com',
  birthdate: '1990-06-25',
  location: 'New York, USA',
  gender: 'Male',
  posts: [
    {
      id: '01a',
      content: 'This is my first post',
      createdAt: '2022-01-01',
    },
    {
      id: '01ab',
      content: 'This is my second post',
      createdAt: '2022-01-02',
    },
  ]
}

const Profile = () => {
  const [personDetails, setPersonDetails] = useState<ProfileProps>(person);
  const [editMode, setEditMode] = useState<boolean>(false);

  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => setPersonDetails({...personDetails, name: e.target.value});
  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => setPersonDetails({...personDetails, email: e.target.value});
  const handleBirthdateInput = (e: React.ChangeEvent<HTMLInputElement>) => setPersonDetails({...personDetails, birthdate: e.target.value});
  const handleLocationInput = (e: React.ChangeEvent<HTMLInputElement>) => setPersonDetails({...personDetails, location: e.target.value});
  const handleGenderCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => setPersonDetails({...personDetails, gender: e.target.value});

  useEffect(() => {
    setPersonDetails(person);
  }, []);

  const setProfilePhoto = () => {

    let profilePhoto;

    if(personDetails?.gender === 'Male'){
      profilePhoto = Male;
    } else if(personDetails?.gender === 'Female') {
      profilePhoto = Female;
    } else {
      profilePhoto = Other;
    }

    return profilePhoto
  }

  const toggleEditMode = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setPersonDetails(person)
    setEditMode(!editMode);
  }

  const handleProfileUpdate = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log(`Profile updated:`);
    console.log(personDetails);
    setEditMode(!editMode);
  }



  return (
    <main className="bg-bgColor w-full flex flex-col items-center gap-4 justify-start">
      <div className='w-4/5 h-fit mx-auto bg-bgColorSecondary rounded-lg flex flex-col lg:flex-row gap-4 items-center justify-center mt-20 px-2 sm:px-4 py-12'>
        <div className='w-full sm:w-4/5 lg:w-1/2 xl:w-1/3 flex justify-center'>
          <img width={400} className='w-full max-w-96 max-h-80' src={setProfilePhoto()} alt="profile photo" />
        </div>
        <form  className='w-full sm:w-4/5 lg:w-1/2 xl:w-1/3 flex flex-col text-white'>
          <label className='rounded-lg ps-2 font-semibold text-primary text-xs'>Name:</label>
          <input 
            onChange={handleNameInput}
            className={`bg-primary ps-2 rounded-lg text-secondary text-lg font-semibold mb-2`} 
            disabled={editMode ? false : true} 
            value={personDetails.name} 
            type='text' 
          />
          <label className='rounded-lg ps-2 font-semibold text-primary text-xs'>Email:</label>
          <input 
            onChange={handleEmailInput}
            className={`bg-primary ps-2 rounded-lg text-secondary text-lg font-semibold mb-2`} 
            disabled={editMode ? false : true} 
            value={personDetails.email} 
            type='email' 
          />
          <label className='rounded-lg ps-2 font-semibold text-primary text-xs'>Birthdate:</label>
          <input 
            onChange={handleBirthdateInput}
            className={`bg-primary ps-2 rounded-lg text-secondary text-lg font-semibold mb-2`} 
            disabled={editMode ? false : true} 
            value={personDetails.birthdate} 
            type='date' 
          />
          <label className='rounded-lg ps-2 font-semibold text-primary text-xs'>Living location:</label>
          <input 
            onChange={handleLocationInput}
            className={`bg-primary ps-2 rounded-lg text-secondary text-lg font-semibold mb-2 appearance-none`} 
            disabled={editMode ? false : true} 
            value={personDetails.location} 
            type='text'
          />
            <label className='rounded-lg ps-2 font-semibold text-primary text-xs'>Gender:</label>
          <div className='flex flex-col bg-primary rounded-lg text-secondary text-lg font-semibold mb-8'>
            <p
              className={`ps-2 w-1/5`} 
            >
              {personDetails.gender}
            </p>
            {editMode && <div className="flex justify-center gap-2 w-4/5 m-auto">
              <label>Male</label>
              <input 
                  type="radio" 
                  name="gender"
                  value='Male'
                  checked={personDetails.gender ==='Male'}
                  onChange={handleGenderCheckbox}
                />
              <label>Female</label>
              <input 
                  type="radio" 
                  name="gender"
                  value='Female'
                  checked={personDetails.gender ==='Female'}
                  onChange={handleGenderCheckbox}
                />
              <label>Other</label>
              <input 
                  type="radio" 
                  name="gender"
                  value='Other'
                  checked={personDetails.gender ==='Other'}
                  onChange={handleGenderCheckbox}
                />
            </div>}
          </div>
          <div className='flex justify-center gap-4 text-white'>
            <button 
              onClick={ toggleEditMode } 
              className='bg-primary px-2 py-1 rounded-lg hover:bg-opacity-60 transition-colors duration-500'
            >
              { editMode ? 'Cancel Editing' : 'Edit Profile'}
            </button>
            {editMode && <button 
                            onClick={handleProfileUpdate} 
                            className='bg-primary px-2 py-1 rounded-lg hover:bg-opacity-60 transition-colors duration-500'
                            >
                              Save Profile
                          </button>
            }
          </div>
        </form>
      </div>
      <h2>Your posts</h2>
      <Post />
    </main>
  )
}

export default Profile

// img 
// full name
// email 
// birthdate 
// location 
// gender 

// btn to edit profile if it is mine 

// render this person posts 