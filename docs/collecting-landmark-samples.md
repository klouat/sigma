# Collecting Landmark Samples

This page explains how to collect training samples for the Arabic character and harakat detector.

## Where collection happens

Open:

```text
/arabic-detector
```

The page can auto-save confirmed samples into:

```text
D:\lidm\dataset
```

## What gets saved

Two kinds of files are created:

- `characters-<label>.jsonl`
- `harakat-<label>.jsonl`

Each line is one sample containing:

- label
- kind
- handedness
- landmarks
- motion trail

## Before you start

1. Run the app locally.
2. Open `/arabic-detector`.
3. Click `Start camera`.
4. Make sure the detector is already recognizing your hand reasonably well.

## Character samples

Use this for:

- `alif`
- `ba`
- `ta`
- `sha`
- `dal`
- `jim`
- `ha`
- `kha`

Steps:

1. Turn on `Collect data`.
2. Set `Collection type` to `character`.
3. Pick the target label.
4. Hold only that hand sign in frame.
5. Wait until the detector confirms that sign.
6. Keep repeating with small variation in angle, height, and distance.

Notes:

- A sample is only saved when the current detector confirms the chosen label.
- Keep the hand fully visible.
- Use one hand only.
- Do not move while collecting character samples.

## Harakat samples

Use this for:

- `fathah`
- `kasrah`

Steps:

1. Turn on `Collect data`.
2. Set `Collection type` to `harakat`.
3. Pick the target label.
4. Form a supported base character.
5. Move the hand in the correct direction:
   - `fathah`: horizontal
   - `kasrah`: downward
6. Wait until the detector confirms the harakat.
7. Repeat the movement many times with slight variation.

Notes:

- Harakat samples include motion trail data.
- Keep the movement clean and deliberate.
- Start with the base sign stable before moving.

## Recommended sample count

Minimum starting target:

- 100 samples per character
- 100 samples per harakat

Better target:

- 200 to 500 samples per class

## Make the dataset useful

Collect variation across:

- different people
- left and right hands if relevant
- different distances from camera
- slightly different angles
- different lighting
- different backgrounds

Avoid:

- cropped hands
- motion blur for character samples
- inconsistent labels
- multiple hands in frame

## Checking progress

While collecting, the page shows:

- current collection status
- saved sample count

You can inspect saved files in:

```text
D:\lidm\dataset
```

## Resetting counters

`Reset counters` only clears the page counters.

It does **not** delete files already written to `D:\lidm\dataset`.

## Training after collection

Once enough samples exist, run:

```powershell
python .\scripts\train_gesture_models.py
```

See also:

- [README-dataset-training.md](D:/lidm/scripts/README-dataset-training.md)
