# DoubtSync

  ## Frontend  deployment     https://capstone-doubt-sync.vercel.app/
### Backend deployment link - https://capstone-doubtsync.onrender.com

## 📘 Project Overview  
**DoubtSync** is a real-time **1-to-1 mentor-student doubt-solving platform** that enables college students to instantly connect with expert mentors for quick and effective doubt resolution. Students can send **text-based questions** or upload **images of their queries**, and mentors provide personalized solutions through live interaction.

DoubtSync is specifically built for college students to resolve doubts related to:

- 📌 Data Structures & Algorithms (DSA)  
- 💻 Web & App Development  
- 🤖 Artificial Intelligence & Machine Learning (AI/ML)  
- 🏗️ System Design  
- 🎯 Career Guidance & Interview Preparation  

---

## 🎯 Target Users

- 🧑‍🎓 **College Students**: Seeking academic and career-related mentorship  
- 🎓 **Mentors/Professionals**: Experienced individuals willing to help learners grow  
- 🏫 **Institutions**: Providing on-demand assistance and career counseling  

---

## ✅ Benefits

- ⚡ **Instant Help**: Get connected with a mentor in seconds  
- 📸 **Image Upload Support**: Send snapshots of handwritten or printed questions  
- 💬 **1-to-1 Interaction**: Focused learning without distractions  
- 🧠 **Expert Guidance**: From people working in tech and academia  
- 🔐 **Secure Authentication**: JWT-based login with role-based access  
- 🔍 **Topic-Based Routing**: Doubts categorized by DSA, ML, etc. for better matching  

---

## 🔧 Features

- Student & Mentor Signup/Login  
- Role-Based Access Control  
- Submit Doubts (Text + Image Upload)  
- Topic-Based Doubt Categorization (DSA, Dev, AI/ML, etc.)  
- Real-Time Mentor Matching Simulation  
- Mentor Dashboard to View & Resolve Doubts  
- Student Dashboard to Track Previous Doubts  
- Secure JWT Authentication (HTTP-only Cookies)  
- MongoDB Storage for Questions, Users, and Sessions  

---

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Mongoose ODM)  
- **Authentication**: JWT (HTTP-only cookies)  
- **File Upload**: Multer  
- **Image Storage**: Local / Cloudinary  
- **Version Control**: Git & GitHub  

---

## 📅 Project Timeline (50 Days)

### Week 1: Planning & Setup (5 days)
- Finalize idea, name, and tech stack  
- Design low & high-fidelity wireframes  
- Setup GitHub repository  
- Plan schema (students, mentors, doubts)

### Week 2: Backend Core (7 days)
- Setup Express server and MongoDB connection  
- Create Mongoose schemas (User, Doubt)  
- Implement authentication logic (JWT, cookies)  
- Create protected routes for role-based access

### Week 3: Frontend Foundation (7 days)
- Initialize React app with Tailwind  
- Create student and mentor dashboards  
- Implement doubt submission with image upload  
- Connect frontend with backend APIs

### Week 4: Advanced Features (7 days)
- Real-time matching logic  
- Display submitted doubts to mentors  
- Add doubt status tracking (Pending, Solved)  
- Display doubt history for students and mentors

### Week 5: Testing & Optimization (7 days)
- Write unit and integration tests  
- Optimize image upload and display  
- Fix bugs and improve UI responsiveness

### Week 6: Documentation & Final Touches (7 days)
- Add final UI polish  
- Collect feedback from peers/mentors  
- Prepare demo video and final README  
- Deployment on Render/Netlify + MongoDB Atlas

### Buffer (10 days)
- Debugging, feedback implementation, deployment fixes

---

## 🧑‍💻 Installation & Setup

### Prerequisites
Ensure you have installed:
- Node.js & npm  
- MongoDB (local or Atlas)  
- Git  

### Steps to Run the Project

1. **Clone the Repository**  
```bash
git clone https://github.com/your-username/DoubtSync.git  
cd DoubtSync
