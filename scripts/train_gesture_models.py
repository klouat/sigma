from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


ROOT = Path(__file__).resolve().parents[1]
DATASET_DIR = ROOT / "dataset"
MODEL_DIR = ROOT / "trained_models"


@dataclass
class Sample:
    label: str
    kind: str
    landmarks: list[dict[str, float]]
    motion_trail: list[dict[str, float]]


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            rows.append(json.loads(line))
    return rows


def load_samples(dataset_dir: Path) -> list[Sample]:
    samples: list[Sample] = []

    for path in sorted(dataset_dir.glob("*.jsonl")):
      rows = load_jsonl(path)
      for row in rows:
          samples.append(
              Sample(
                  label=row["label"],
                  kind=row["kind"],
                  landmarks=row["landmarks"],
                  motion_trail=row.get("motionTrail", []),
              )
          )

    return samples


def normalize_landmarks(landmarks: list[dict[str, float]]) -> np.ndarray:
    points = np.array([[p["x"], p["y"], p["z"]] for p in landmarks], dtype=np.float32)

    wrist = points[0]
    points = points - wrist

    palm_scale = np.linalg.norm(points[5, :2] - points[17, :2])
    if palm_scale < 1e-6:
        palm_scale = 1.0

    points = points / palm_scale
    return points.reshape(-1)


def motion_features(motion_trail: list[dict[str, float]]) -> np.ndarray:
    if not motion_trail:
        return np.zeros(16, dtype=np.float32)

    arr = np.array([[p["time"], p["x"], p["y"]] for p in motion_trail], dtype=np.float32)
    start = arr[0]
    end = arr[-1]
    delta = end[1:] - start[1:]
    total_distance = 0.0

    if len(arr) > 1:
        total_distance = float(
            np.sum(np.linalg.norm(np.diff(arr[:, 1:3], axis=0), axis=1))
        )

    duration = max(float(end[0] - start[0]), 1.0)
    velocity = delta / duration

    x_series = arr[:, 1]
    y_series = arr[:, 2]

    features = np.array(
        [
            float(delta[0]),
            float(delta[1]),
            float(abs(delta[0])),
            float(max(delta[1], 0.0)),
            float(total_distance),
            float(duration),
            float(velocity[0]),
            float(velocity[1]),
            float(np.mean(x_series)),
            float(np.mean(y_series)),
            float(np.std(x_series)),
            float(np.std(y_series)),
            float(np.min(x_series)),
            float(np.max(x_series)),
            float(np.min(y_series)),
            float(np.max(y_series)),
        ],
        dtype=np.float32,
    )

    return features


def build_character_dataset(samples: list[Sample]) -> tuple[np.ndarray, np.ndarray]:
    rows: list[np.ndarray] = []
    labels: list[str] = []

    for sample in samples:
        if sample.kind != "character":
            continue
        rows.append(normalize_landmarks(sample.landmarks))
        labels.append(sample.label)

    if not rows:
        raise ValueError("No character samples found in dataset.")

    return np.vstack(rows), np.array(labels)


def build_harakat_dataset(samples: list[Sample]) -> tuple[np.ndarray, np.ndarray]:
    rows: list[np.ndarray] = []
    labels: list[str] = []

    for sample in samples:
        if sample.kind != "harakat":
            continue
        landmark_features = normalize_landmarks(sample.landmarks)
        movement_features = motion_features(sample.motion_trail)
        rows.append(np.concatenate([landmark_features, movement_features]))
        labels.append(sample.label)

    if not rows:
        raise ValueError("No harakat samples found in dataset.")

    return np.vstack(rows), np.array(labels)


def train_classifier(
    x: np.ndarray, y: np.ndarray, random_state: int
) -> tuple[Pipeline, dict[str, Any]]:
    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.2,
        random_state=random_state,
        stratify=y,
    )

    model = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            (
                "classifier",
                RandomForestClassifier(
                    n_estimators=300,
                    random_state=random_state,
                    class_weight="balanced",
                    min_samples_leaf=2,
                ),
            ),
        ]
    )
    model.fit(x_train, y_train)

    report = classification_report(
        y_test,
        model.predict(x_test),
        output_dict=True,
        zero_division=0,
    )
    metadata = {
        "classes": sorted(set(y.tolist())),
        "train_size": int(len(x_train)),
        "test_size": int(len(x_test)),
        "accuracy": float(report["accuracy"]),
        "report": report,
    }
    return model, metadata


def save_model(name: str, model: Pipeline, metadata: dict[str, Any]) -> None:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    joblib.dump(model, MODEL_DIR / f"{name}.joblib")
    with (MODEL_DIR / f"{name}.metadata.json").open("w", encoding="utf-8") as handle:
        json.dump(metadata, handle, indent=2)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Train character and harakat classifiers from collected landmark dataset."
    )
    parser.add_argument(
        "--dataset-dir",
        default=str(DATASET_DIR),
        help="Directory containing collected .jsonl samples.",
    )
    parser.add_argument(
        "--random-state",
        type=int,
        default=42,
        help="Random seed for train/test split and model training.",
    )
    args = parser.parse_args()

    dataset_dir = Path(args.dataset_dir)
    if not dataset_dir.exists():
        raise FileNotFoundError(f"Dataset directory not found: {dataset_dir}")

    samples = load_samples(dataset_dir)
    if not samples:
        raise ValueError(f"No samples found in {dataset_dir}")

    character_x, character_y = build_character_dataset(samples)
    harakat_x, harakat_y = build_harakat_dataset(samples)

    character_model, character_metadata = train_classifier(
        character_x, character_y, args.random_state
    )
    harakat_model, harakat_metadata = train_classifier(
        harakat_x, harakat_y, args.random_state
    )

    save_model("character-model", character_model, character_metadata)
    save_model("harakat-model", harakat_model, harakat_metadata)

    print("Character model accuracy:", round(character_metadata["accuracy"], 4))
    print("Harakat model accuracy:", round(harakat_metadata["accuracy"], 4))
    print(f"Saved models to {MODEL_DIR}")


if __name__ == "__main__":
    main()
