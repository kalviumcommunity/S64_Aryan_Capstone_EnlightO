

# Backend deployment link: https://s64-aryan-capstone-enlighto.onrender.com







Capstone Project: EnlightO 
Project Overview
Idea Brief
The e-learning platform will allow users to create, browse, enroll in, and complete courses. It will support video lessons, quizzes, progress tracking, authentication, and user roles (students & instructors). The platform will also feature an admin panel for managing courses and users.
Technology Stack
Frontend: React (Vite), Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB (Atlas)
Authentication: OTP-based signup, JWT & Google OAuth
Payment Gateway: Razorpay (Test Mode)
Deployment: Netlify (Frontend), Render (Backend)
Testing: Jest
Containerization: Docker (Future Expansion)

Platform Walkthrough
Homepage
Contains a Get Started button and student testimonials.
Navigation bar with Home, Courses, About, and Login options.
Clicking Get Started redirects to the Login Page.
Authentication
Signup: OTP-based signup.
Login: Standard login with JWT authentication.
After login, the Login button in the Navigation bar changes to Account.
Account Page
Displays My Profile (Name, Email).
Options: Dashboard and Logout.
Dashboard (User)
Displays all owned courses.
Each course has a View Lectures button.
Clicking a lecture plays the course video.
Courses Page
Lists all available courses.
Clicking Get Started shows course details with a Buy Now option.
Payment is processed via Razorpay (Test Mode).
After successful payment, redirects to Payment Success Page.
Payment Success Page has payment details nad payment successful message along with Go to Dashboard button.
The purchased course appears in the Dashboard.
Admin Features
Admin Login available.
Admin Dashboard shows:
Total Courses
Total Lectures
Total Users
Navigation: Home, Courses, Users, Logout.
Admin Course Management
Courses Section lists all uploaded courses.
Options: Study or Delete a course.
Add Course Form with:
Title, Description
Category Selection
Price Field
Created By Field
Duration Field
Upload Thumbnail Field
Lecture Management:
Clicking Study on a course shows Lectures.
Option to Add Lecture (Title, Description, File Upload).
Option to Delete Lecture.
User Management (Admin)
Lists all registered users with details.
Each user has an Update Role button.
Responsiveness
The entire platform will be fully responsive for different screen sizes.




Day 1: Setting Up the Project
Initialize backend server (Express.js with Node.js)
Set up MongoDB database (Atlas)
Create folder structure for backend
Set up GitHub repository with README
Day 2: User Authentication - Signup
Create user model and schema
Implement register API
Setup OTP-based verification
Test API using Postman
Day 3: User Authentication - Login & Profile
Implement login API
Secure authentication using JWT
Create user profile API
Test and debug login system
Day 4: Course Management - Adding Courses
Create course model and schema
Implement API to add a new course
Validate course input and store data in DB
Test and debug course creation
Day 5: Lecture Management - Adding Lectures
Create lecture model and schema
Implement API to add lectures to courses
Upload lecture videos to cloud storage
Test and debug lecture creation
Day 6: Course & Lecture Retrieval
Implement API to get course details
Implement API to get lectures by course
Test and debug retrieval endpoints
Day 7: Payment Integration (Backend)
Set up Razorpay test mode
Implement payment API
Store payment details in database
Test payment flow using Postman
Day 8: Setting Up Frontend (React)
Initialize React project with Vite
Setup folder structure for frontend
Install dependencies and setup Tailwind CSS
Create navigation bar with routes
Day 9: Authentication Pages (Frontend)
Create signup page with OTP verification
Create login page
Integrate authentication API with frontend
Day 10: Home & Footer
Design homepage layout with testimonials
Implement "Get Started" button
Create footer with relevant links
Day 11: Integrating Authentication
Connect login and signup API with frontend
Handle authentication state using context
Redirect users based on authentication status
Day 12: Building Courses Page
Fetch and display courses from API
Implement "Buy Now" button with course details
Design course details page
Day 13: Payment Page (Frontend)
Design payment page UI
Connect payment API with frontend
Handle successful and failed payments
Day 14: Student Dashboard
Fetch and display purchased courses
Implement navigation to lecture page
Show "No courses purchased" message if empty
Day 15: Lecture Page
Fetch and display lectures for a course
Implement video player to play lectures
Allow users to navigate between lectures
Day 16: Admin Controls - Course Management
Implement admin login and authentication
Create admin dashboard with total courses, users, lectures
Allow admin to delete courses
Day 17: Admin Controls - Lecture Management
Add lecture upload functionality
Implement lecture deletion feature
List all lectures under a course
Day 18: User Management (Admin Panel)
Fetch and display user list
Implement "Update Role" feature for users
Allow admin to change user roles
Day 19: Final Enhancements & Testing
Fix UI bugs and improve responsiveness
Conduct full application testing
Optimize API responses and database queries
Day 20: Deployment
Deploy backend to Render
Deploy frontend to Cloudflare
Configure domain and test live project
Submit capstone project for review

Optional Future Expansions (Level 2 Concepts)
AI-powered course recommendations.
Dockerizing the application.
Implementing live video sessions.
Adding a certificate generation feature upon course completion
Course completion progress tracker.
Implement forgot password and reCaptcha.
 
  
   


This document will be updated as the project progresses. Please review and provide feedback!