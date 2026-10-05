import os
import pickle
import pandas as pd
from flask import Flask, render_template, request

app = Flask(__name__)

FEATURE_COLUMNS = [
    'Stream',
    'CGPA',
    'Internships',
    'Projects',
    'SkillScore',
    'Backlogs'
]

# Stream mapping used by the project
STREAM_NAMES = {
    2: "Computer Science",
    3: "Information Technology",
    4: "Other"
}

# Convert user-entered skills into categories understood by the model
SKILL_ALIASES = {
    "python": "python",
    "java": "java_cpp",
    "c": "java_cpp",
    "c++": "java_cpp",
    "cpp": "java_cpp",

    "dsa": "dsa",
    "data structures": "dsa",
    "data structures and algorithms": "dsa",
    "data structures & algorithms": "dsa",
    "algorithms": "dsa",

    "sql": "sql",
    "mysql": "sql",
    "postgresql": "sql",
    "database": "sql",
    "databases": "sql",

    "html": "web",
    "css": "web",
    "javascript": "web",
    "js": "web",
    "web development": "web",
    "frontend": "web",
    "front end": "web",
    "full stack": "web",
    "full-stack": "web",

    "ai": "aiml",
    "artificial intelligence": "aiml",
    "machine learning": "aiml",
    "ml": "aiml",
    "deep learning": "aiml",

    "cloud": "cloud",
    "aws": "cloud",
    "azure": "cloud",
    "gcp": "cloud",
    "devops": "cloud",
    "docker": "cloud",

    "django": "web",
    "flask": "web",
    "backend": "web",
    "back end": "web",

    "git": "other",
    "github": "other",
    "linux": "other"
}

MODEL_PATH = "model.pkl"

if os.path.exists(MODEL_PATH):
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
else:
    model = None
    print("Warning: model.pkl not found! Please run 'python train.py' first.")


def normalize_skills(skills_text):
    skills = []

    for skill in skills_text.split(","):
        skill = skill.strip().lower()

        if not skill:
            continue

        category = SKILL_ALIASES.get(skill)

        if category:
            skills.append(category)
        else:
            skills.append("other")

    # Remove duplicate categories
    skills = list(dict.fromkeys(skills))

    return skills


def calculate_skill_score(selected_skills):

    weights = {
        "dsa": 1.2,
        "python": 1.0,
        "java_cpp": 1.0,
        "sql": 0.8,
        "aiml": 0.8,
        "web": 0.7,
        "cloud": 0.7,
        "other": 0.5
    }

    points = sum(
        weights.get(skill, 0.5)
        for skill in selected_skills
    )

    if points >= 4.0:
        return 5
    elif points >= 2.8:
        return 4
    elif points >= 1.8:
        return 3
    elif points >= 0.8:
        return 2
    else:
        return 1


def evaluate_company_tiers(cgpa, backlogs, projects, skills):

    tiers = []

    # Tier 1
    tier1_eligible = (
        cgpa >= 8.0
        and backlogs == 0
        and "dsa" in skills
        and projects >= 1
    )

    if tier1_eligible:
        t1_reason = (
            "Meets all criteria: CGPA 8.0+, zero backlogs, "
            "DSA skills, and project portfolio."
        )
    else:
        missing = []

        if cgpa < 8.0:
            missing.append("CGPA 8.0+")

        if backlogs > 0:
            missing.append("0 backlogs")

        if "dsa" not in skills:
            missing.append("DSA skills")

        if projects < 1:
            missing.append("1+ major project")

        t1_reason = f"Requires: {', '.join(missing)}."

    tiers.append({
        "tier": "Tier 1: Product & Tech Giants",
        "companies": "Amazon, Microsoft, Google, Adobe, Atlassian",
        "package": "12 - 25+ LPA",
        "eligible": tier1_eligible,
        "reason": t1_reason,
        "badge_class": (
            "bg-success"
            if tier1_eligible
            else "bg-secondary"
        )
    })

    # Tier 2
    tier2_eligible = (
        cgpa >= 7.0
        and backlogs <= 1
        and projects >= 1
        and len(skills) >= 2
    )

    if tier2_eligible:
        t2_reason = (
            "Meets criteria: CGPA 7.0+, "
            "hands-on projects, and active tech skills."
        )
    else:
        missing = []

        if cgpa < 7.0:
            missing.append("CGPA 7.0+")

        if backlogs > 1:
            missing.append("Maximum 1 backlog")

        if projects < 1:
            missing.append("1+ project")

        if len(skills) < 2:
            missing.append("2+ technical skills")

        t2_reason = f"Requires: {', '.join(missing)}."

    tiers.append({
        "tier": "Tier 2: High-Growth Tech & FinTech",
        "companies": "Zoho, Freshworks, Oracle, Capgemini, Virtusa",
        "package": "6 - 12 LPA",
        "eligible": tier2_eligible,
        "reason": t2_reason,
        "badge_class": (
            "bg-primary"
            if tier2_eligible
            else "bg-secondary"
        )
    })

    # Tier 3
    tier3_eligible = (
        cgpa >= 6.0
        and backlogs <= 1
        and len(skills) >= 1
    )

    if tier3_eligible:
        t3_reason = (
            "Meets standard eligibility cutoff "
            "(CGPA 6.0+ and baseline technical skills)."
        )
    else:
        missing = []

        if cgpa < 6.0:
            missing.append("CGPA 6.0+")

        if backlogs > 1:
            missing.append(
                "Clearing backlogs down to 1 or 0"
            )

        if len(skills) < 1:
            missing.append(
                "At least 1 technical skill"
            )

        t3_reason = f"Requires: {', '.join(missing)}."

    tiers.append({
        "tier": "Tier 3: IT Services & Mass Recruiters",
        "companies": "TCS, Infosys, Wipro, Accenture, Cognizant",
        "package": "3.5 - 6.5 LPA",
        "eligible": tier3_eligible,
        "reason": t3_reason,
        "badge_class": (
            "bg-info text-dark"
            if tier3_eligible
            else "bg-secondary"
        )
    })

    return tiers, tier1_eligible


def calibrate_probability(
    raw_chance,
    tier1_eligible,
    backlogs,
    skills
):

    chance = float(raw_chance)

    if chance >= 94.0:

        if tier1_eligible:
            chance = 93.5
        else:
            chance = 86.5

    elif chance <= 5.0:
        chance = 8.5

    if "dsa" not in skills and chance > 87.0:
        chance = 86.0

    if backlogs == 1 and chance > 72.0:
        chance = 70.0

    elif backlogs >= 2 and chance > 35.0:
        chance = 28.5

    return round(chance, 1)


def generate_action_plan(
    cgpa,
    backlogs,
    internships,
    projects,
    skills
):

    plan = []

    if "dsa" not in skills:
        plan.append({
            "title": "Learn Data Structures & Algorithms (DSA)",
            "boost": "Improve coding interview readiness",
            "detail": (
                "Learn Arrays, Strings, Linked Lists, Stacks, "
                "Queues, Trees, Graphs and basic Algorithms."
            )
        })

    if backlogs > 0:
        plan.append({
            "title": "Clear Active Backlogs",
            "boost": "Improve company eligibility",
            "detail": (
                f"You currently have {backlogs} backlog(s). "
                "Clearing them can improve eligibility for "
                "more campus recruitment opportunities."
            )
        })

    if projects < 2:
        plan.append({
            "title": "Build 1 More Real-World Project",
            "boost": "Strengthen your portfolio",
            "detail": (
                "Build and upload another practical project "
                "to GitHub with a clear README and screenshots."
            )
        })

    if internships == 0:
        plan.append({
            "title": "Complete an Internship or Open-Source Work",
            "boost": "Gain practical experience",
            "detail": (
                "An internship or open-source contribution "
                "can strengthen your resume and interview experience."
            )
        })

    if 6.0 <= cgpa < 7.5:
        plan.append({
            "title": "Improve Your CGPA",
            "boost": "Broader eligibility",
            "detail": (
                "Try to improve your CGPA because some companies "
                "use academic cutoffs during recruitment."
            )
        })

    if not plan:
        plan.append({
            "title": "Practice Technical & HR Interviews",
            "boost": "Final preparation",
            "detail": (
                "Focus on programming fundamentals, projects, "
                "SQL, DSA and common HR questions."
            )
        })

    return plan


@app.route('/')
def home():
    return render_template("placement.html")


@app.route('/stud_plac', methods=["POST"])
def predict():

    if model is None:
        return render_template(
            "placement.html",
            error="Model not loaded. Please run 'python train.py'."
        )

    try:

        # Candidate name
        student_name = request.form.get(
            "student_name",
            ""
        ).strip()

        if not student_name:
            student_name = "Candidate"

        # Basic inputs
        stream = int(
            request.form.get("stream")
        )

        cgpa = float(
            request.form.get("cgpa")
        )

        internships = int(
            request.form.get("internship")
        )

        backlogs = int(
            request.form.get("backlogs", 0)
        )

        projects = int(
            request.form.get("projects", 0)
        )

        # Project details
        project_name_1 = request.form.get(
            "project_name_1",
            ""
        ).strip()

        project_domain_1 = request.form.get(
            "project_domain_1",
            "Web / Full-Stack"
        )

        project_name_2 = request.form.get(
            "project_name_2",
            ""
        ).strip()

        project_domain_2 = request.form.get(
            "project_domain_2",
            "AI / Machine Learning"
        )

        # Technical skills
        skills_text = request.form.get(
            "skills",
            ""
        ).strip()

        selected_skills = normalize_skills(
            skills_text
        )

        skill_score = calculate_skill_score(
            selected_skills
        )

        # Validation
        if not (0.0 <= cgpa <= 10.0):
            return render_template(
                "placement.html",
                error=(
                    "Please enter a valid CGPA "
                    "between 0.0 and 10.0."
                )
            )

        if stream not in STREAM_NAMES:
            return render_template(
                "placement.html",
                error=(
                    "Please select Computer Science, "
                    "Information Technology or Other."
                )
            )

        if backlogs < 0:
            return render_template(
                "placement.html",
                error="Backlogs cannot be negative."
            )

        if projects < 0:
            return render_template(
                "placement.html",
                error="Projects cannot be negative."
            )

        # Create model input
        input_data = pd.DataFrame(
            [[
                stream,
                cgpa,
                internships,
                projects,
                skill_score,
                backlogs
            ]],
            columns=FEATURE_COLUMNS
        )

        # Prediction
        prediction = int(
            model.predict(input_data)[0]
        )

        probabilities = model.predict_proba(
            input_data
        )[0]

        raw_chance = round(
            probabilities[1] * 100,
            1
        )

        # Company evaluation
        company_tiers, tier1_eligible = (
            evaluate_company_tiers(
                cgpa,
                backlogs,
                projects,
                selected_skills
            )
        )

        # Action plan
        action_plan = generate_action_plan(
            cgpa,
            backlogs,
            internships,
            projects,
            selected_skills
        )

        # Placement probability
        placement_chance = calibrate_probability(
            raw_chance,
            tier1_eligible,
            backlogs,
            selected_skills
        )

        # Tip
        if backlogs >= 2:

            tip = (
                f"Notice: Having {backlogs} active backlogs "
                "may reduce eligibility for many campus drives. "
                "Clearing backlogs should be your priority."
            )

        elif not tier1_eligible and placement_chance >= 80:

            tip = (
                "Strong profile! You have a good foundation "
                "for technical placements. Strengthening DSA "
                "can improve your coding interview readiness."
            )

        elif tier1_eligible:

            tip = (
                "Strong technical profile! Focus on DSA, "
                "core CS fundamentals, mock interviews "
                "and explaining your projects clearly."
            )

        else:

            tip = (
                "Good foundation! Follow the action plan "
                "below to improve your placement readiness."
            )

        # Keep original skills for displaying in the result
        readable_skills = [
            skill.strip()
            for skill in skills_text.split(",")
            if skill.strip()
        ]

        submitted_data = {

            "student_name": student_name,

            "stream": stream,

            "stream_name": STREAM_NAMES.get(
                stream,
                "Other"
            ),

            "cgpa": cgpa,

            "internship": internships,

            "backlogs": backlogs,

            "projects": projects,

            "project_name_1": project_name_1,

            "project_domain_1": project_domain_1,

            "project_name_2": project_name_2,

            "project_domain_2": project_domain_2,

            "skills_text": skills_text,

            "selected_skills": selected_skills,

            "readable_skills": readable_skills
        }

        return render_template(
            "placement.html",

            prediction=prediction,

            chance=placement_chance,

            tip=tip,

            inputs=submitted_data,

            company_tiers=company_tiers,

            action_plan=action_plan
        )

    except ValueError:

        return render_template(
            "placement.html",
            error=(
                "Invalid input. Please ensure all "
                "fields are filled with valid values."
            )
        )

    except Exception as e:

        return render_template(
            "placement.html",
            error=f"An error occurred: {str(e)}"
        )


if __name__ == '__main__':
    app.run(debug=True)