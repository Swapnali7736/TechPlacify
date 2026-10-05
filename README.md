# 💻 TechPlacify – Technical Student Placement Predictor

A Machine Learning web application built with Python and Flask that predicts campus placement outcomes, evaluates student eligibility for different company tiers, and provides personalized career action plans.


## 📌 Overview

Traditional placement prediction models often focus primarily on academic scores such as CGPA. TechPlacify considers additional factors, including **projects built**, **technical skills**, **internship experience**, and **active backlog counts**, to evaluate a student's placement readiness.

This application evaluates a student's profile using the following features:

1. **Candidate Profile:** Student Name, Stream (Computer Science, Information Technology, or Other), CGPA, and active backlog count (`0`, `1`, `2`, `3`).

2. **Practical Experience:** Number of completed internships.

3. **Project Portfolio:** Number of projects, with entries for both **Primary (Major)** and **Secondary (Minor)** projects along with their domains (Web / Full-Stack, AI / Machine Learning, Mobile App, Cloud / DevOps, Other).

4. **Technical Skillset:** Free-text technical skill input supporting skills such as Python, Java, C++, DSA, SQL, Web Development, AI/ML, Cloud, Django, Flask, JavaScript, and Git.

5. **Placement Probability:** Displays an estimated placement probability based on the trained Machine Learning model output and additional project-specific adjustment rules.

6. **Company Tier Matching:** Evaluates eligibility for Tier 1 Product & Tech Giants, Tier 2 High-Growth Tech & FinTech, and Tier 3 IT Services & Mass Recruiters.

7. **Personalized Action Plan:** Generates practical recommendations based on CGPA, backlogs, projects, internships, and technical skills to help students improve their placement readiness.


## 💡 Key Highlights

* **Holistic Placement Readiness Analysis:** Considers CGPA, internships, projects, technical skills, and backlogs instead of relying only on academic scores.

* **Company Tier Eligibility Matching:**

  * **Tier 1 (12–25+ LPA):** Amazon, Google, Microsoft, Adobe, Atlassian
  * **Tier 2 (6–12 LPA):** Zoho, Freshworks, Oracle, Capgemini, Virtusa
  * **Tier 3 (3.5–6.5 LPA):** TCS, Infosys, Wipro, Accenture, Cognizant

* **Personalized Action Plan:** Suggests improvements such as learning Data Structures and Algorithms (DSA), clearing active backlogs, building additional projects, gaining internship experience, and improving CGPA.

* **Multiple Projects Showcase:** Allows students to enter details for both a Primary Project and an optional Secondary Project.

* **Flexible Technical Skill Input:** Accepts comma-separated skills and maps recognized skills into categories used by the Machine Learning model.

* **Backlog Analysis:** Evaluates the number of active backlogs when determining company-tier eligibility and generating career recommendations.

* **Pre-Trained Machine Learning Model:** Uses a Scikit-learn `DecisionTreeClassifier` saved as `model.pkl` to generate placement predictions.


## 🛠️ Tech Stack

* **Language:** Python 3
* **Machine Learning:** Scikit-learn (`DecisionTreeClassifier`)
* **Data Manipulation:** Pandas
* **Web Framework:** Flask
* **Frontend:** HTML5, CSS3, Bootstrap 5, Jinja2
* **Model Storage:** Pickle


## 📁 Project Structure

```text
TechPlacify/
├── app.py                         # Flask web application and prediction logic
├── train.py                       # ML model training and evaluation script
├── model.pkl                      # Serialized trained model
├── collegePlacement_cleanData.csv # Placement dataset
├── templates/
│   └── placement.html             # Bootstrap 5 user interface
├── requirements.txt               # Dependencies
├── .gitignore                     # Git ignore rules
└── README.md                      # Project documentation
```



## 🚀 How to Run Locally

### 1. Clone the Repository

Replace the example URL with your actual GitHub repository URL.

```bash
git clone <your-repository-url>
cd TechPlacify
```

### 2. Set Up a Virtual Environment

**On Windows:**

```bash
python -m venv venv
.\venv\Scripts\activate
```

**On macOS/Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Train the Model (Optional, if `model.pkl` is already included)

```bash
python train.py
```

### 5. Launch the Web Application

```bash
python app.py
```

Open your browser and navigate to:

```text
http://127.0.0.1:5000/
```


## 📊 Model Evaluation

* **Algorithm:** Decision Tree Classifier
* **Model File:** `model.pkl`
* **Input Features:** Stream, CGPA, Internships, Projects, SkillScore, and Backlogs
* **Prediction Output:** Placement classification and estimated placement probability
* **Evaluation Criteria:** Student academic performance, internship experience, project count, technical skill score, and backlog count.


**Disclaimer:** Placement predictions and company-tier recommendations are estimates for educational purposes only and do not guarantee actual placement or salary.
