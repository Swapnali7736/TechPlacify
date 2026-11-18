import os
import pickle
from pathlib import Path
import pandas as pd
from django.conf import settings

FEATURE_COLUMNS = [
    'Stream',
    'CGPA',
    'Internships',
    'Projects',
    'SkillScore',
    'Backlogs'
]

STREAM_NAMES = {
    2: "Computer Science",
    3: "Information Technology",
    4: "Other"
}

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

# Cache model in memory
_MODEL = None

def get_model():
    global _MODEL
    if _MODEL is None:
        model_path = Path(settings.BASE_DIR) / "model.pkl"
        if not model_path.exists():
            # Fallback to parent directory if not found in backend/
            model_path = Path(settings.BASE_DIR).parent / "model.pkl"
        
        if model_path.exists():
            with open(model_path, "rb") as f:
                _MODEL = pickle.load(f)
        else:
            raise FileNotFoundError(f"model.pkl not found at {model_path}")
    return _MODEL


def normalize_skills(skills_text):
    skills = []
    if not skills_text:
        return skills

    for skill in skills_text.split(","):
        skill = skill.strip().lower()
        if not skill:
            continue
        category = SKILL_ALIASES.get(skill)
        if category:
            skills.append(category)
        else:
            skills.append("other")

    # Remove duplicate categories preserving order
    return list(dict.fromkeys(skills))


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

    points = sum(weights.get(skill, 0.5) for skill in selected_skills)

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
        t1_reason = "Meets all criteria: CGPA 8.0+, zero backlogs, DSA skills, and project portfolio."
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
        "badge_class": "success" if tier1_eligible else "secondary"
    })

    # Tier 2
    tier2_eligible = (
        cgpa >= 7.0
        and backlogs <= 1
        and projects >= 1
        and len(skills) >= 2
    )

    if tier2_eligible:
        t2_reason = "Meets criteria: CGPA 7.0+, hands-on projects, and active tech skills."
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
        "badge_class": "primary" if tier2_eligible else "secondary"
    })

    # Tier 3
    tier3_eligible = (
        cgpa >= 6.0
        and backlogs <= 1
        and len(skills) >= 1
    )

    if tier3_eligible:
        t3_reason = "Meets standard eligibility cutoff (CGPA 6.0+ and baseline technical skills)."
    else:
        missing = []
        if cgpa < 6.0:
            missing.append("CGPA 6.0+")
        if backlogs > 1:
            missing.append("Clearing backlogs down to 1 or 0")
        if len(skills) < 1:
            missing.append("At least 1 technical skill")
        t3_reason = f"Requires: {', '.join(missing)}."

    tiers.append({
        "tier": "Tier 3: IT Services & Mass Recruiters",
        "companies": "TCS, Infosys, Wipro, Accenture, Cognizant",
        "package": "3.5 - 6.5 LPA",
        "eligible": tier3_eligible,
        "reason": t3_reason,
        "badge_class": "info" if tier3_eligible else "secondary"
    })

    return tiers, tier1_eligible


def calibrate_probability(raw_chance, tier1_eligible, backlogs, skills):
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


def generate_action_plan(cgpa, backlogs, internships, projects, skills):
    plan = []

    if "dsa" not in skills:
        plan.append({
            "title": "Learn Data Structures & Algorithms (DSA)",
            "boost": "Improve coding interview readiness",
            "detail": "Learn Arrays, Strings, Linked Lists, Stacks, Queues, Trees, Graphs and basic Algorithms."
        })

    if backlogs > 0:
        plan.append({
            "title": "Clear Active Backlogs",
            "boost": "Improve company eligibility",
            "detail": f"You currently have {backlogs} backlog(s). Clearing them can improve eligibility for more campus recruitment opportunities."
        })

    if projects < 2:
        plan.append({
            "title": "Build 1 More Real-World Project",
            "boost": "Strengthen your portfolio",
            "detail": "Build and upload another practical project to GitHub with a clear README and screenshots."
        })

    if internships == 0:
        plan.append({
            "title": "Complete an Internship or Open-Source Work",
            "boost": "Gain practical experience",
            "detail": "An internship or open-source contribution can strengthen your resume and interview experience."
        })

    if 6.0 <= cgpa < 7.5:
        plan.append({
            "title": "Improve Your CGPA",
            "boost": "Broader eligibility",
            "detail": "Try to improve your CGPA because some companies use academic cutoffs during recruitment."
        })

    if not plan:
        plan.append({
            "title": "Practice Technical & HR Interviews",
            "boost": "Final preparation",
            "detail": "Focus on programming fundamentals, projects, SQL, DSA and common HR questions."
        })

    return plan


def predict_placement(stream, cgpa, internships, backlogs, projects, skills_text):
    model = get_model()
    selected_skills = normalize_skills(skills_text)
    skill_score = calculate_skill_score(selected_skills)

    input_data = pd.DataFrame(
        [[stream, cgpa, internships, projects, skill_score, backlogs]],
        columns=FEATURE_COLUMNS
    )

    prediction = int(model.predict(input_data)[0])
    probabilities = model.predict_proba(input_data)[0]
    raw_chance = float(round(probabilities[1] * 100, 1))

    company_tiers, tier1_eligible = evaluate_company_tiers(cgpa, backlogs, projects, selected_skills)
    action_plan = generate_action_plan(cgpa, backlogs, internships, projects, selected_skills)
    placement_chance = float(calibrate_probability(raw_chance, tier1_eligible, backlogs, selected_skills))

    tip = ""
    if backlogs >= 2:
        tip = f"Notice: Having {backlogs} active backlogs significantly limits campus eligibility. Prioritize clearing them."
    elif not tier1_eligible:
        tip = "Tip: Adding DSA mastery and an extra full-stack/AI project can unlock Tier 1 eligibility."

    return {
        "prediction": prediction,
        "placement_chance": placement_chance,
        "raw_chance": raw_chance,
        "skill_score": int(skill_score),
        "selected_skills": selected_skills,
        "tier1_eligible": bool(tier1_eligible),
        "company_tiers": company_tiers,
        "action_plan": action_plan,
        "tip": tip
    }
