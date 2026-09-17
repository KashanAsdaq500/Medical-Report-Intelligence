import pandas as pd
from sklearn.model_selection import train_test_split


# Load dataset
df = pd.read_csv("data/diabetes.csv")

# Check basic information
print("Dataset shape:", df.shape)
print("\nMissing values:")
print(df.isnull().sum())

# Separate features and target
X = df.drop("Outcome", axis=1)
y = df["Outcome"]

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\nTraining data:", X_train.shape)
print("Testing data:", X_test.shape)
