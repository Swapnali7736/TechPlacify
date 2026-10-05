"""
College Placement Predictor - Model Training Script
Trains a Decision Tree Classifier using practical merit features:
- Stream
- CGPA
- Internships
- Projects
- SkillScore
- Backlogs (Number of active/past backlogs: 0, 1, 2, 3+)
Saves the trained model to 'model.pkl'.
"""

import pickle
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

def train():
    # 1. Load the dataset
    csv_file = "collegePlacement_cleanData.csv"
    print(f"Loading data from {csv_file}...")
    df = pd.read_csv(csv_file)

    # 2. Select the core features and target
    features = ['Stream', 'CGPA', 'Internships', 'Projects', 'SkillScore', 'Backlogs']
    target = 'PlacedOrNot'

    X = df[features]
    y = df[target]

    # 3. Split into Train (80%) and Test (20%) sets to evaluate
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # 4. Train the Decision Tree Classifier
    model = DecisionTreeClassifier(max_depth=5, random_state=42)
    model.fit(X_train, y_train)

    # 5. Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nModel Evaluation on Test Data:")
    print(f"Accuracy: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # 6. Re-train on full data for maximum coverage
    model.fit(X, y)

    # 7. Save model to 'model.pkl'
    model_filename = "model.pkl"
    with open(model_filename, "wb") as f:
        pickle.dump(model, f)

    print(f"Success! Trained model saved to '{model_filename}'.")

if __name__ == "__main__":
    train()
