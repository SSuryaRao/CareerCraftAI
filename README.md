# 🚀 AI Career Advisor

**Your intelligent companion for career growth and job success in India**

## 📋 Overview

AI Career Advisor is a comprehensive platform designed specifically for Indian students and professionals to navigate their career journey using cutting-edge AI technology. The platform addresses the unique challenges of the Indian job market by providing personalized career guidance, skill development roadmaps, ATS-optimized resume analysis, and intelligent job matching.

### Key Objectives
- **Personalized Career Guidance**: AI-powered recommendations tailored for Indian job market
- **Skills Gap Analysis**: Identify and bridge skill gaps with curated learning paths
- **ATS Optimization**: Ensure resumes pass Application Tracking Systems used by Indian companies
- **Financial Planning**: ROI calculator to evaluate career investments and salary projections
- **Opportunity Discovery**: Find relevant scholarships, internships, and job opportunities

### Unique Features
- **Indian Market Focus**: Algorithms trained on Indian salary data, company requirements, and career trends
- **Multi-language Support**: Designed for India's diverse linguistic landscape
- **Government Integration**: Direct access to government scholarships and skill development programs
- **Industry-specific Guidance**: Tailored advice for IT, Finance, Healthcare, Engineering, and other key sectors

---

## 🎯 Demo Links

- **Live Demo**: Coming Soon
- **Screenshots**: See screenshots section below
- **Video Demo**: [Upload demo video here]

---

## ✨ Features

### 🔍 **Resume Upload + ATS Score Analysis**
- Upload PDF resumes and get instant ATS compatibility scores
- Detailed suggestions for improving keyword density and formatting
- Industry-specific optimization recommendations

### 🗺️ **AI-Powered Career Roadmap Generator**
- Interactive roadmaps with tickable milestones and progress tracking
- Personalized learning paths based on current skills and target roles
- Integration with popular learning platforms and resources

### 💰 **ROI Calculator (Skill-to-Salary)**
- Calculate return on investment for skill certifications and courses
- Salary projection based on Indian market data
- Cost-benefit analysis for career transitions

### 🎓 **Scholarship & Internship Recommender**
- AI-curated list of relevant scholarships from government and private organizations
- Internship matching based on skills, location, and career goals
- Real-time application deadlines and eligibility tracking

### 🤖 **AI Career Chatbot**
- 24/7 intelligent career counseling and guidance
- Natural language processing for personalized advice
- Integration with knowledge base of career resources

### 💼 **Smart Job Matching**
- AI-powered job recommendations with match percentage scores
- Real-time job scraping from multiple Indian job portals
- Salary insights and company culture information

### 🏆 **Gamified Progress Tracker**
- Achievement system for completing milestones
- Progress visualization with charts and analytics
- Peer comparison and community features

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Charts**: Recharts
- **File Upload**: React Dropzone
- **PDF Processing**: PDF.js
- **Maps**: Leaflet, React Leaflet

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **API Architecture**: RESTful APIs
- **Authentication**: JWT
- **File Processing**: Multer, PDF-Parse
- **Scheduling**: Node-cron

### **Database & Storage**
- **Primary Database**: MongoDB Atlas
- **File Storage**: Firebase Storage
- **Cloud Storage**: Firebase Cloud Storage

### **AI & Machine Learning**
- **Primary AI**: Google Gemini AI (Generative AI)
- **Chatbot**: Google Dialogflow CX (planned)
- **Text Processing**: Natural Language Processing

### **External APIs & Services**
- **Job APIs**: RemoteOK, Jooble, Adzuna
- **Government Data**: Indian Government Scholarship APIs
- **Maps**: OpenStreetMap via Leaflet
- **Analytics**: Vercel Analytics

### **DevOps & Infrastructure**
- **Hosting**: Render (Backend), Vercel (Frontend)
- **Version Control**: Git
- **Environment**: Docker-ready configuration
- **Monitoring**: Morgan logging, Error tracking

---

## 📁 Project Structure

```
career-advisor/
├── Backend2/                    # Main backend application
│   ├── credentials/            # Firebase and API credentials
│   ├── logs/                   # Application logs
│   ├── src/
│   │   ├── config/            # Database and service configurations
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Authentication, logging, validation
│   │   ├── models/           # MongoDB data models
│   │   ├── routes/           # API route definitions
│   │   ├── scripts/          # Utility and maintenance scripts
│   │   ├── services/         # Business logic and external API services
│   │   ├── utils/            # Helper functions and utilities
│   │   └── server.js         # Application entry point
│   ├── .env                  # Environment variables
│   └── package.json          # Backend dependencies
│
├── frontend/                   # Next.js frontend application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── app/              # Next.js 13+ app directory
│   │   │   ├── (auth)/       # Authentication pages
│   │   │   ├── dashboard/    # User dashboard
│   │   │   ├── features/     # Feature-specific pages
│   │   │   ├── profile/      # User profile management
│   │   │   └── solutions/    # Career solutions pages
│   │   ├── components/       # Reusable React components
│   │   │   ├── layout/       # Layout components (Header, Footer, etc.)
│   │   │   └── ui/           # UI component library (shadcn/ui)
│   │   └── lib/              # Utility functions and configurations
│   ├── .env.local            # Frontend environment variables
│   └── package.json          # Frontend dependencies
│
├── Backend/                    # Legacy backend (Python - deprecated)
│   └── venv/                 # Python virtual environment
│
├── diagrams/                   # Architecture and flow diagrams
├── .claude/                   # Claude Code configuration
├── SCHOLARSHIP_FEATURE_SUMMARY.md  # Feature documentation
└── README.md                 # This file
```

---

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js (v16.0.0 or higher)
- npm or yarn package manager
- MongoDB Atlas account
- Firebase account
- Google Cloud Platform account (for Gemini AI)

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/career-advisor.git
cd career-advisor
```

### **2. Backend Setup**

```bash
# Navigate to backend directory
cd Backend2

# Install dependencies
npm install

# Create .env file with the following variables:
```

#### **Environment Variables (Backend2/.env)**
```bash
# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# Server Configuration
PORT=5000
NODE_ENV=development

# API Configuration
REMOTEOK_API_URL=https://remoteok.io/api

# Security
JWT_SECRET=your_jwt_secret_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_SERVICE_ACCOUNT_KEY=your_firebase_service_account_json

# Optional: Dialogflow CX (for advanced chatbot)
DIALOGFLOW_PROJECT_ID=your_dialogflow_project_id
DIALOGFLOW_AGENT_ID=your_dialogflow_agent_id
GOOGLE_APPLICATION_CREDENTIALS=path_to_service_account_json
```

```bash
# Start the backend server
npm run dev
# or for production
npm start
```

### **3. Frontend Setup**

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env.local file with:
```

#### **Environment Variables (frontend/.env.local)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

```bash
# Start the frontend development server
npm run dev
```

### **4. Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs (if implemented)

---

## 💡 Usage Instructions

### **📄 Resume Upload & Analysis**
1. Navigate to Features → Resume Analyzer
2. Upload your PDF resume
3. Receive instant ATS score and improvement suggestions
4. Download optimized resume template

### **🗺️ Generate Career Roadmap**
1. Go to Solutions → Roadmap
2. Select your target role and current skill level
3. Get personalized learning path with milestones
4. Track progress with interactive checkboxes

### **💰 Calculate ROI**
1. Access Features → ROI Calculator
2. Input desired skills/certifications
3. Get salary projections and investment analysis
4. Compare different career paths

### **🎓 Find Scholarships**
1. Visit Features → Scholarship Finder
2. Apply filters (education level, field, location)
3. Browse AI-recommended opportunities
4. Save and track application deadlines

### **💼 Job Matching**
1. Complete your profile in Dashboard
2. Browse Jobs section for AI-matched positions
3. View match percentage and job details
4. Apply directly through integrated portals

---

## 🔗 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### **Resume Analysis**
- `POST /api/resume/upload` - Upload and analyze resume
- `GET /api/resume/score/:id` - Get ATS score
- `POST /api/resume/suggestions` - Get improvement suggestions

### **Career Roadmaps**
- `GET /api/roadmaps` - Get available roadmap templates
- `POST /api/roadmaps/generate` - Generate personalized roadmap
- `PUT /api/roadmaps/progress` - Update progress
- `GET /api/roadmaps/user/:userId` - Get user's roadmaps

### **Job Recommendations**
- `GET /api/jobs/recommendations` - Get job recommendations
- `POST /api/jobs/search` - Search jobs with filters
- `GET /api/jobs/details/:jobId` - Get job details

### **Scholarships**
- `GET /api/scholarships` - Get scholarship opportunities
- `POST /api/scholarships/filter` - Filter scholarships
- `POST /api/scholarships/apply` - Track scholarship applications

### **Chatbot**
- `POST /api/chatbot/message` - Send message to AI chatbot
- `GET /api/chatbot/health` - Chatbot service health check

### **Progress Tracking**
- `GET /api/progress/user/:userId` - Get user progress
- `POST /api/progress/update` - Update progress milestone
- `GET /api/progress/analytics` - Get progress analytics

---

## 📸 Screenshots

### Dashboard Overview
![Dashboard Screenshot](screenshots/dashboard.png)
*Main dashboard showing career progress and recommendations*

### Resume Analysis
![Resume Analysis](screenshots/resume-analysis.png)  
*ATS score analysis with detailed improvement suggestions*

### Career Roadmap
![Career Roadmap](screenshots/roadmap.png)
*Interactive career roadmap with progress tracking*

### ROI Calculator
![ROI Calculator](screenshots/roi-calculator.png)
*Skill investment ROI calculation with salary projections*

### Scholarship Finder
![Scholarship Finder](screenshots/scholarships.png)
*AI-powered scholarship recommendations*

---

## 🔮 Future Improvements

### **Phase 2 Features**
- **Advanced AI Mentor Avatars**: 3D interactive career mentors
- **Video Interview Practice**: AI-powered mock interview system
- **Peer Learning Network**: Connect with similar career paths
- **Industry Expert Sessions**: Live Q&A with professionals

### **Enhanced AI Capabilities**
- **Predictive Career Analytics**: Future job market trends
- **Personalized Learning Content**: AI-generated study materials
- **Smart Calendar Integration**: Automated learning schedules
- **Voice-based Career Counseling**: Speech-enabled interactions

### **Market Expansion**
- **Multi-regional Support**: Expand beyond India to Southeast Asia
- **Local Language Models**: Support for regional languages
- **University Partnerships**: Direct integration with educational institutions
- **Corporate Tie-ups**: Enterprise solutions for organizations

### **Technical Enhancements**
- **Mobile Application**: Native iOS and Android apps
- **Offline Mode**: Download roadmaps for offline access
- **Advanced Analytics**: Machine learning insights dashboard
- **Real-time Collaboration**: Team-based learning features

---

## 🤝 Contributing

We welcome contributions from developers, career counselors, and domain experts!

### **How to Contribute**

1. **Fork the repository**
   ```bash
   git fork https://github.com/your-username/career-advisor.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style and conventions
   - Add appropriate tests for new features
   - Update documentation if necessary

4. **Test your changes**
   ```bash
   # Backend tests
   cd Backend2 && npm test
   
   # Frontend tests  
   cd frontend && npm test
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "Add amazing feature"
   git push origin feature/amazing-feature
   ```

6. **Create a Pull Request**
   - Provide clear description of changes
   - Include screenshots for UI changes
   - Reference related issues

### **Development Guidelines**
- Follow ESLint configuration for code style
- Write meaningful commit messages
- Add JSDoc comments for new functions
- Maintain test coverage above 80%
- Ensure mobile responsiveness for UI changes

### **Types of Contributions**
- 🐛 Bug fixes and error handling improvements
- ✨ New features and enhancements
- 📖 Documentation improvements
- 🧪 Test coverage improvements
- 🎨 UI/UX design enhancements
- 🌐 Internationalization and localization

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 AI Career Advisor Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### **Special Thanks**
- **Google GenAI Hackathon** - For providing the platform and inspiration
- **Indian Government** - For open scholarship and job data APIs
- **Open Source Community** - For the amazing tools and libraries

### **Technologies & APIs**
- **Google Gemini AI** - Advanced language model for personalized recommendations
- **Firebase** - Real-time database and storage solutions
- **MongoDB Atlas** - Scalable cloud database platform
- **Vercel** - Frontend hosting and deployment platform
- **Render** - Backend hosting and API deployment
- **RemoteOK & Jooble** - Job data and opportunities
- **OpenStreetMap** - Geographic data and mapping services

### **Design & UI**
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful and customizable UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Beautiful open-source icon library

### **Development Tools**
- **Next.js Team** - Outstanding React framework
- **Vercel Team** - Excellent developer experience platform
- **MongoDB Team** - Powerful database solutions
- **Google Cloud Team** - AI and cloud infrastructure

---

## 📞 Support & Contact

### **Get Help**
- **Documentation**: Check our comprehensive docs
- **GitHub Issues**: Report bugs and request features
- **Community Discord**: Join our developer community
- **Email Support**: contact@careeraidvisor.com

### **Connect With Us**
- **Website**: https://careeraidvisor.com
- **LinkedIn**: [@ai-career-advisor](https://linkedin.com/company/ai-career-advisor)
- **Twitter**: [@CareerAIAdvisor](https://twitter.com/CareerAIAdvisor)
- **YouTube**: [AI Career Advisor Channel](https://youtube.com/@careeraidvisor)

---

<p align="center">
  <strong>Built with ❤️ for the future of career guidance in India</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/your-username/career-advisor?style=social" alt="GitHub stars">
  <img src="https://img.shields.io/github/forks/your-username/career-advisor?style=social" alt="GitHub forks">
  <img src="https://img.shields.io/github/issues/your-username/career-advisor" alt="GitHub issues">
  <img src="https://img.shields.io/github/license/your-username/career-advisor" alt="License">
</p>