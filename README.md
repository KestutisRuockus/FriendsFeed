# **FriendFeed**

## **Introduction**

**FriendFeed** is a social media platform where users can connect, share, and engage with others through posts and messages. This project challenges the boundaries of typical CRUD applications by integrating real-time data, user authentication, and a conversation management system.

## **Demo**

You can view a live demo of the project [here](https://friendfeed.netlify.app/).

### **Screenshots**

#### Login

<div>
  <img src="https://raw.githubusercontent.com/KestutisRuockus/showcase/main/src/assets/friendFeed/FriendFeed-login.png" alt="Login" width="600" />
</div>

#### HomePage

<div>
  <img src="https://raw.githubusercontent.com/KestutisRuockus/showcase/main/src/assets/friendFeed/FriendFeed-home-page.png" alt="Login" width="600" />
</div>

#### Create Post

<div>
  <img src="https://raw.githubusercontent.com/KestutisRuockus/showcase/main/src/assets/friendFeed/FriendFeed-create-post.png" alt="Login" width="600" />
</div>

#### Responsive Design

<div>
  <img src="https://raw.githubusercontent.com/KestutisRuockus/showcase/main/src/assets/friendFeed/FriendFeed-responsive-design.png" alt="Login" width="600" />
</div>

## **Features**

- **Authentication**: Users must register and log in using Firebase authentication (email and password). Users remain logged in unless they explicitly click the "Log Out" button.
- **Post Management (CRUD)**: Logged-in users can:
  - Create posts with a title, content, and images.
  - Update or delete their own posts.
  - Comment on other users’ posts.
  - Delete comments on their posts or their own comments.
- **Responsive design** for different screen sizes.

- **Likes and Dislikes**: Posts can be liked or disliked by any user.

- **Real-Time Messaging**: Users can send and receive messages in real time using Firebase.

  - Messages are editable by the sender.

- **Conversation Manager**: Manages active conversations by adding/removing tabs, opening/closing conversation windows, and more.

## **Technologies Used**

#### **Frontend**

- **React.js**: For building the user interface.
- **React Router**: For managing client-side routing.
- **Tailwind CSS**: For styling the application with a utility-first approach.

#### **Backend/Database**

- **Firebase**:
  - **Authentication**: For user registration and login.
  - **Firestore**: For real-time database functionality.

#### **Utilities**

- **Browser Image Compression**: For reducing the size of uploaded images.
- **UUID**: For generating unique identifiers for posts, comments, and other entities.
- **Emoji Picker React**: For adding emojis to messages or posts.

#### **Development Tools**

- **Vite**: For fast development and optimized builds.
- **TypeScript**: For type safety and better maintainability of the codebase.
- **ESLint**: For enforcing consistent code style and catching potential issues.
- **PostCSS & Autoprefixer**: For ensuring CSS compatibility across different browsers.

## **Setup Instructions**

To run this project locally, follow these steps:

#### · **Step 1**: Clone the project repository to your local machine:

```bash
git clone https://github.com/KestutisRuockus/FriendFeed.git
```

#### · **Step 2**: Navigate to the project directory:

```bash
cd FriendFeed
```

#### · **Step 3**: Install the project dependencies:

```bash
npm install
```

#### · **Step 4**: Create a .env file in the root directory and add your Firebase credentials:

##### VITE_API_KEY=your_firebase_api_key

##### VITE_AUTH_DOMAIN=your_firebase_auth_domain

##### VITE_PROJECT_ID=your_firebase_project_id

##### VITE_STORAGE_BUCKET=your_firebase_storage_bucket

##### VITE_MESSAGING_SENDER=your_firebase_messaging_sender_id

##### VITE_APP_ID=your_firebase_app_id

#### · **Step 5**: Start the development server:

```bash
npm run dev
```

You can now open the app in your browser at http://localhost:XXXX.
