# 💻 TechPlacify – Technical Student Placement Predictor 

**TechPlacify** is a full-stack web application built using **React.js, Django REST Framework (DRF), and Scikit-learn** that predicts campus placement outcomes, evaluates student eligibility for different company tiers, and provides personalized career action plans.

Unlike traditional prediction models that primarily consider academic scores such as CGPA, TechPlacify factors in **technical skills, hands-on projects, internship experience, and active backlogs** to evaluate a student's placement readiness.

##  Key Features

###  1. Complete Authentication System

- **User Registration:** Students can create accounts with their academic branch, email, username, and credentials.
- **JWT Authentication:** Secure authentication using JSON Web Tokens (Access and Refresh tokens).
- **Automatic Token Refresh:** Axios interceptors handle token refresh when access tokens expire.
- **Password Reset:** Forgot Password and Reset Password functionality.
- **Protected Routes:** Dashboard and prediction history are accessible only to authenticated users.

###  2. Intelligent Placement Predictor

- **Multi-Factor Analysis:** Evaluates CGPA, academic branch, internships, projects, active backlogs, and technical skills.
- **Machine Learning Model:** Uses a trained Scikit-learn `DecisionTreeClassifier` saved as `model.pkl`.
- **Placement Probability:** Displays an estimated placement probability based on model predictions and additional application-level adjustment rules.
- **Interactive Probability Meter:** Visualizes placement probability using a circular gauge with color-coded indicators.

###  3. Company Tier Eligibility Matching

Evaluates student profiles against different company tiers based on academic performance, projects, technical skills, and backlogs.

| Company Tier | Illustrative Salary Range | Example Companies |
|---|---|---|
| **Tier 1 – Product & Tech Giants** | 12–25+ LPA | Amazon, Google, Microsoft, Adobe, Atlassian |
| **Tier 2 – High-Growth Tech & FinTech** | 6–12 LPA | Zoho, Freshworks, Oracle, Capgemini, Virtusa |
| **Tier 3 – IT Services & Mass Recruiters** | 3.5–6.5 LPA | TCS, Infosys, Wipro, Accenture, Cognizant |

**Eligibility Evaluation:**

- **Tier 1:** Considers CGPA 8.0+, zero backlogs, DSA skills, and major projects.
- **Tier 2:** Considers CGPA 7.0+, projects, and technical skills.
- **Tier 3:** Evaluates students against baseline eligibility criteria.

The application displays eligibility status and identifies missing requirements to help students understand what they need to improve.

*Note: Salary ranges and eligibility criteria are illustrative benchmarks used by the application and may vary across actual company recruitment processes.*

###  4. Personalized Career Action Plan

Generates personalized recommendations based on a student's profile, such as:

- Improving CGPA.
- Learning Data Structures and Algorithms (DSA).
- Clearing active backlogs.
- Building additional projects.
- Gaining internship experience.
- Strengthening technical skills.

###  5. Prediction History Tracking

- Automatically saves prediction records.
- Displays previous prediction results.
- Helps students track placement probability over time.
- Allows users to delete older prediction records.

###  6. Project Portfolio Analysis

- Supports primary (major) and secondary (minor) projects.
- Accepts project names and domains.
- Considers the number of projects during placement readiness evaluation.

###  7. Technical Skill Analysis

Supports flexible technical skill input, including:

- Python
- Java
- C++
- DSA
- SQL
- Web Development
- AI/ML
- Cloud
- Django
- Flask
- JavaScript
- Git

Recognized skills are mapped into categories used by the placement prediction system.

##  Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| Styling | Tailwind CSS, CSS3 |
| Routing | React Router |
| API Communication | Axios |
| Icons | Lucide React |
| Backend | Python, Django, Django REST Framework |
| Authentication | SimpleJWT |
| Machine Learning | Scikit-learn, DecisionTreeClassifier |
| Data Processing | Pandas, NumPy |
| Model Storage | Pickle |
| Database | SQLite |
| Development Tools | Git, GitHub, VS Code, Postman |




## 📁 Project Structure

```text
TechPlacify/
│
├── backend/
│   ├── accounts/
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── predictions/
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── ml_service.py
│   │   └── urls.py
│   │
│   ├── techplacify_backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── model.pkl
│   └── manage.py
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── History.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPasswordConfirm.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── run_backend.bat
├── run_frontend.bat
├── requirements.txt
└── README.md
```

##  Installation & Setup

### Prerequisites

Make sure the following tools are installed:

- Python 3.x
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Swapnali7736/TechPlacify.git
cd TechPlacify
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

### 3. Activate Virtual Environment

**Windows PowerShell:**

```powershell
venv\Scripts\activate
```

### 4. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 5. Setup Django Backend

Navigate to the backend directory:

```bash
cd backend
```

Apply database migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

**Backend URL:** http://127.0.0.1:8000/

### 6. Setup React Frontend

Open a new terminal from the project root.

Navigate to the frontend directory:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

**Frontend URL:** http://localhost:5173/

##  Application Workflow

1. A student registers and logs into TechPlacify.
2. The student enters academic details, technical skills, internships, projects, and backlog information.
3. The React frontend sends the information to the Django REST API.
4. The backend processes the submitted student profile.
5. The Machine Learning model predicts the placement outcome and estimated probability.
6. The system evaluates eligibility for different company tiers.
7. Personalized recommendations are generated based on the student's profile.
8. The prediction is saved to the database.
9. Students can view their previous predictions through the history page.

##  Project Objective

TechPlacify aims to help students understand their placement readiness, identify suitable company tiers, recognize skill gaps, and take actionable steps toward improving their employability.

By combining Machine Learning-based prediction with profile-based eligibility evaluation and personalized career recommendations, TechPlacify provides students with a structured approach to placement preparation.

##  Disclaimer

Placement probabilities are estimates generated by the application's prediction logic and do not guarantee actual recruitment or placement. Company salary ranges and eligibility criteria are illustrative and may differ from actual recruitment requirements.

