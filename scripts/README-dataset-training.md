# Dataset Training

This project can auto-save landmark samples into `D:\lidm\dataset` through the detector page.

## Files produced by collection

- `dataset/characters-<label>.jsonl`
- `dataset/harakat-<label>.jsonl`

Each line is one JSON sample containing:

- `label`
- `kind`
- `handedness`
- `landmarks`
- `motionTrail`

## Train the first models

From the repo root:

```powershell
python .\scripts\train_gesture_models.py
```

Optional:

```powershell
python .\scripts\train_gesture_models.py --dataset-dir D:\lidm\dataset --random-state 42
```

## Output

The script writes:

- `trained_models/character-model.joblib`
- `trained_models/character-model.metadata.json`
- `trained_models/harakat-model.joblib`
- `trained_models/harakat-model.metadata.json`

## Requirements

Python packages:

- `numpy`
- `scikit-learn`
- `joblib`

Install if needed:

```powershell
python -m pip install numpy scikit-learn joblib
```

## Notes

- Character training uses single-frame normalized landmarks.
- Harakat training uses normalized landmarks plus motion-trail features.
- Current output is an offline Python model artifact. A later step is converting inference into a browser-friendly format and replacing the heuristic classifier in the app.
