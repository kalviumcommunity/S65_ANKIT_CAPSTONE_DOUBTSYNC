import React, { useState } from "react";

import CustomCursor from "../components/CustomCursor";
import { useNavigate } from "react-router-dom";
import "../components/css/LandingPage.css";
import Lottie from "lottie-react";
import ConnectAnimation from '../assets/online-videocall.json';

import avatar1 from "../assets/avatars/avatar1.jpg"
import avatar2 from "../assets/avatars/avatar2.jpg"
import avatar3 from "../assets/avatars/avatar3.jpg"
import Doubtlogo from "../assets/doubtsync-logo.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate, faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";
import { Bolt, Video, ShieldCheck } from 'lucide-react';
import { BoltIcon } from '@heroicons/react/24/solid';

import { Lightbulb, Zap, ThumbsUp } from "lucide-react"; 
import { Activity } from "lucide-react";



const LandingPage = () => {
 
  
  const [faqOpen, setFaqOpen] = useState(null);
  
  
  const [authType, setAuthType] = useState("");
  const [showRolePopup, setShowRolePopup] = useState(false);
  const navigate = useNavigate();
  
  
    const handleGetStarted = () => {
         handleAuthClick("signup") 
    };

  const handleAuthClick = (type) => {
    setAuthType(type);
    setShowRolePopup(true);
  };

  const handleRoleSelect = (role) => {
    navigate(`/${authType}/${role}`);
    setShowRolePopup(false);
    setAuthType("");
  };



  const ChevronDown = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const ChevronRight = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );



  return (
    <div className="landing-page">

<CustomCursor />



     
    <header className="navbar">
  <div className="logo-section">
    <div className="logo-wrapper">
      <img src={Doubtlogo} alt="DoubtSync Logo" className="logo" />
    </div>
    <span className="brand-name">DoubtSync</span>
  </div>
<div className="nav-buttons">
  <button onClick={() => handleAuthClick("login")} className="login-button">
    Login
  </button>
  <button onClick={() => handleAuthClick("signup")} className="signup-button">
    Sign Up
  </button>
</div>

    </header>











{showRolePopup && (
  <div className="popup-overlay">
    <div className="popup-box">
      <h3>Select your role</h3>
      <div className="role-buttons">
        <button onClick={() => handleRoleSelect("student")}>
          <FontAwesomeIcon icon={faUserGraduate} style={{ marginRight: "8px" }} />
          Student
        </button>
        <button onClick={() => handleRoleSelect("teacher")}>
          <FontAwesomeIcon icon={faChalkboardTeacher} style={{ marginRight: "8px" }} />
          Teacher
        </button>
      </div>
      <button className="close-popup" onClick={() => setShowRolePopup(false)}>
        ❌ Cancel
      </button>
    </div>
  </div>
)}










      {/* Hero Section */}
      <main className="hero-section">
        <div className="announcement-banner">
          ⚡ Instant 1-on-1 Help from Expert Mentors — Anytime, Anywhere!
        </div>

<h1 className="main-heading">
  Save Time. Learn Faster.<br />
  <span className="gradient-text">Connect with Mentors Instantly.</span>
</h1>







        <p className="sub-heading">
          DoubtSync connects you to live mentors in under 60 seconds.<br />
          No more waiting. Just real-time solutions.
        </p>

        <button onClick={handleGetStarted} className="get-started">
          {"Get Started"}
        </button>

      </main>






<div className="section-divider"></div>




<section className="expert-matching">
  <h2 className="expert-heading">
    <span className="highlight-text">Connect instantly</span>
    <span className="subtext">with top experts across every domain.</span>
  </h2>

  <div className="marquee">
    <div className="marquee-content">
      <div className="subject">System Design</div>
      <div className="subject">AI-ML</div>
      <div className="subject">UI-UX</div>
      <div className="subject">DSA</div>
      <div className="subject">Blockchain</div>
      <div className="subject">Cybersecurity</div>

      {/* Duplicated for seamless loop */}
      <div className="subject">System Design</div>
      <div className="subject">AI-ML</div>
      <div className="subject">UI-UX</div>
      <div className="subject">DSA</div>
      <div className="subject">Blockchain</div>
      <div className="subject">Cybersecurity</div>
    </div>
  </div>
</section>







<div className="section-divider"></div>







<section className="why-choose">
  <h2 className="why-choose-heading">💡 Why Choose DoubtSync?</h2>
  <div className="why-cards">
    
    <div className="why-card">
<div className="why-icon">
  <BoltIcon className="icon-bolt" />
</div>
      <h3>Instant Connectivity</h3>
      <p>Connect to a subject expert in less than 60 seconds — no queues, no delays.</p>
    </div>

    <div className="why-card">
      <div className="why-icon">
        <Video size={36} color="#00c2ff" />
      </div>
      <h3>Live 1-on-1 Doubt Solving</h3>
      <p>Interact over HD video/audio with screen sharing and collaborative tools.</p>
    </div>

    <div className="why-card">
      <div className="why-icon">
        <ShieldCheck size={36} color="#ff6b81" />
      </div>
      <h3>Secure & Confidential</h3>
      <p>All sessions are end-to-end encrypted with privacy-first architecture.</p>
    </div>

  </div>
</section>

{/* ------------------------------ */}

<div className="section-divider"></div>


 <section className="impact-section">
<h2 className="impact-heading">
  <span className="impact-heading-icon">
    <Activity size={36} />
  </span>
  Real-Time Impact
</h2>

<p className="impact-subtitle">
  Empowering learners, one session at a time.
</p>

      <div className="impact-grid">
        <div className="impact-card">
          <span className="impact-icon">
            <Lightbulb size={28} />
          </span>
          <span className="impact-number">12,500+</span>
          <span className="impact-label">Doubts Solved</span>
        </div>

        <div className="impact-card">
          <span className="impact-icon">
            <Zap size={28} />
          </span>
          <span className="impact-number">8s Avg</span>
          <span className="impact-label">Match Time</span>
        </div>

        <div className="impact-card">
          <span className="impact-icon">
            <ThumbsUp size={28} />
          </span>
          <span className="impact-number">98%</span>
          <span className="impact-label">Student Satisfaction</span>
        </div>
      </div>
    </section>




{/* --------------------------------- */}



<div className="section-divider"></div>











<section className="testimonial-section">
  <h2 className="testimonial-title">What Learners Are Saying</h2>


  <div className="testimonial-cards">
    <div className="testimonial-card">
      <p>“DoubtSync helped me ace my coding interview! I got connected to a senior engineer in 30 seconds.”</p>
      <div className="testimonial-meta">
        <img src={avatar2} alt="Student 1" />
        <span>Ritika | CS Grad, IIT Delhi</span>
      </div>
    </div>
    <div className="testimonial-card">
      <p>“The mentors are amazing — I get help with UI/UX design instantly, even at 2AM!”</p>
      <div className="testimonial-meta">
        <img src={avatar1} alt="Student 2" />
        <span>Yash | Design Intern, NID</span>
      </div>
    </div>
    <div className="testimonial-card">
      <p>“Solving doubts over live video made learning way easier. I recommend it to all juniors.”</p>
      <div className="testimonial-meta">
        <img src={avatar3} alt="Student 3" />
        <span>Mehul | GATE Topper 2024</span>
      </div>
    </div>
  </div>
</section>





















<div className="section-divider"></div>

<section className="how-it-works">
<h2 className="how-it-works-title">How It Works</h2>

  <div className="how-it-works-container">
    {/* LEFT: Steps */}
    <div className="how-it-works-steps">
      <div className="step-glow">
        <div className="step-icon">📝</div>
        <div className="step-text">
          <h3>1. Sign Up</h3>
          <p>Create your profile and join our expert-driven platform.</p>
        </div>
      </div>
      <div className="step-glow">
        <div className="step-icon">❓</div>
        <div className="step-text">
          <h3>2. Post Your Doubt</h3>
          <p>Share your query to get expert assistance immediately.</p>
        </div>
      </div>
      <div className="step-glow">
        <div className="step-icon">🤝</div>
        <div className="step-text">
          <h3>3. Get Matched Instantly</h3>
          <p>We’ll connect you with the right expert for your problem.</p>
        </div>
      </div>
      <div className="step-glow">
        <div className="step-icon">🎥</div>
        <div className="step-text">
          <h3>4. Solve in Live AV Session</h3>
          <p>Engage in a real-time audio/video session and solve efficiently.</p>
        </div>
      </div>
    </div>

    {/* RIGHT: Animation */}
    <div className="how-it-works-animation">
      <Lottie animationData={ConnectAnimation} loop={true} />
    </div>
  </div>
</section>





{/* -------------------------- */}
<div className="section-divider"></div>

<section className="faq-section">
  <h2 className="faq-title">💬 Frequently Asked Questions</h2>
  <div className="faq-list">
    {[
      {
        question: "What subjects or topics can I ask about?",
        answer: "You can ask about any academic or technical topic including coding, design, system design, AI/ML, cybersecurity, and more.",
      },
      {
        question: "How quickly will I be matched with a mentor?",
        answer: "Typically, you'll be matched within 30–60 seconds after posting your doubt.",
      },
      {
        question: "Is it free to use DoubtSync?",
        answer: "We offer a limited number of free sessions, after which you can choose from affordable plans.",
      },
      {
        question: "Can I choose a specific mentor?",
        answer: "Currently, we auto-match based on your subject, but mentor profiles will be available soon.",
      }
    ].map((faq, index) => (
      <div
        className={`faq-item ${faqOpen === index ? "open" : ""}`}
        key={index}
        onClick={() => setFaqOpen(faqOpen === index ? null : index)}
      >
        <div className="faq-question">
          <span>{faq.question}</span>
          <span className="faq-toggle">
            {faqOpen === index ? <ChevronDown /> : <ChevronRight />}
          </span>
        </div>
        <div className="faq-answer">{faq.answer}</div>
      </div>
    ))}
  </div>
</section>

<div className="section-divider"></div>
<footer className="footer">
  <div className="footer-container">
    
    <div className="footer-brand">
      <img src={Doubtlogo} alt="DoubtSync Logo" className="footer-logo" />
      <h2 className="footer-title">DoubtSync</h2>
      <p className="footer-tagline">Real-time doubt solving. Anywhere. Anytime.</p>
    </div>

    <div className="footer-links">
      <div className="footer-section">
        <h4>Product</h4>
        <ul>
          <li><a href="#">Features</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">Waitlist</a></li>
        </ul>
      </div>

      <div className="footer-section">
        <h4>Company</h4>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>

      <div className="footer-section">
        <h4>Resources</h4>
        <ul>
          <li><a href="#">Blog</a></li>
          <li><a href="#">FAQs</a></li>
          <li><a href="#">Support</a></li>
        </ul>
      </div>
    </div>
  </div>

  <div className="footer-bottom">
    <p>© 2025 DoubtSync. All rights reserved.</p>
  </div>
</footer>




    </div>
  );
};

export default LandingPage;
