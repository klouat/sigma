"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type {
  HandLandmarker,
  HandLandmarkerResult,
  NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import { Camera, CameraOff, Hand, ScanSearch } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CollectionLabel, CollectedSample, Connection, LiveDetection, MotionSample } from "@/lib/gestures/types";
import {
  KNOWN_CHARACTERS,
  KNOWN_HARAKAT,
  HAND_MODEL_PATH,
  HAND_WASM_PATH,
  UI_REFRESH_MS,
  CHARACTER_THRESHOLD,
  HARAKAT_CHARACTER_THRESHOLD,
  HARAKAT_THRESHOLD,
  MOTION_HISTORY_MS,
  TRAIL_POINT_LIMIT,
  CHARACTER_COLORS,
  HARAKAT_COLORS,
  MIRROR_STYLE,
} from "@/lib/gestures/constants";
import { classifyCharacter } from "@/lib/gestures/classify";
import {
  classifyHarakatMotion,
  getTrackingCenter,
  getHandBounds,
  getCombinedArabic,
} from "@/lib/gestures/features";

function drawResults(
  canvas: HTMLCanvasElement,
  result: HandLandmarkerResult,
  detections: LiveDetection[],
  connections: Connection[],
  motionHistory: Record<string, MotionSample[]>
) {
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineCap = "round";
  context.lineJoin = "round";
  context.font = "600 13px sans-serif";

  result.landmarks.forEach((landmarks, index) => {
    const detection = detections[index];
    const handId = detection?.id;
    const stroke = detection?.harakat
      ? HARAKAT_COLORS[detection.harakat.key]
      : CHARACTER_COLORS[detection?.character?.key ?? "unknown"];
    const bounds = getHandBounds(landmarks, canvas.width, canvas.height);
    const samples = handId ? motionHistory[handId] ?? [] : [];

    if (samples.length > 1) {
      context.strokeStyle = `${stroke}88`;
      context.lineWidth = 4;
      context.beginPath();

      samples.forEach((sample, sampleIndex) => {
        const x = sample.x * canvas.width;
        const y = sample.y * canvas.height;

        if (sampleIndex === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      });

      context.stroke();
    }

    context.strokeStyle = stroke;
    context.lineWidth = 3;

    for (const connection of connections) {
      const start = landmarks[connection.start];
      const end = landmarks[connection.end];

      context.beginPath();
      context.moveTo(start.x * canvas.width, start.y * canvas.height);
      context.lineTo(end.x * canvas.width, end.y * canvas.height);
      context.stroke();
    }

    for (const point of landmarks) {
      context.fillStyle = "#ffffff";
      context.beginPath();
      context.arc(point.x * canvas.width, point.y * canvas.height, 4, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = stroke;
      context.beginPath();
      context.arc(point.x * canvas.width, point.y * canvas.height, 2, 0, Math.PI * 2);
      context.fill();
    }

    context.strokeStyle = stroke;
    context.lineWidth = 2;
    context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

    const label = detection?.harakat
      ? `${detection.combinedArabic ?? detection.harakat.label} ${detection.harakatAccuracy.toFixed(1)}%`
      : detection?.character
        ? `${detection.character.label} ${detection.character.arabic} ${detection.characterAccuracy.toFixed(1)}%`
        : "Show a supported character sign";

    const labelWidth = context.measureText(label).width + 20;
    const labelX = bounds.x;
    const labelY = Math.max(18, bounds.y - 10);

    context.fillStyle = stroke;
    context.fillRect(labelX, labelY - 16, labelWidth, 24);
    context.fillStyle = "#082c3c";
    context.fillText(label, labelX + 10, labelY);
  });
}

export function ArabicSignDetector() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const lastUiRefreshRef = useRef(0);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const handConnectionsRef = useRef<Connection[]>([]);
  const motionHistoryRef = useRef<Record<string, MotionSample[]>>({});

  const [detections, setDetections] = useState<LiveDetection[]>([]);
  const [modelStatus, setModelStatus] = useState("Loading hand detector...");
  const [cameraStatus, setCameraStatus] = useState("Camera is offline.");
  const [isModelReady, setIsModelReady] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lastCharacterDetected, setLastCharacterDetected] =
    useState<LiveDetection | null>(null);
  const [lastHarakatDetected, setLastHarakatDetected] =
    useState<LiveDetection | null>(null);
  const [collectionMode, setCollectionMode] = useState(false);
  const [collectionKind, setCollectionKind] = useState<"character" | "harakat">(
    "character"
  );
  const [collectionLabel, setCollectionLabel] = useState<CollectionLabel>("alif");
  const [collectedSamples, setCollectedSamples] = useState<CollectedSample[]>([]);
  const [savedSampleCount, setSavedSampleCount] = useState(0);
  const [collectionStatus, setCollectionStatus] = useState("Collection is idle.");
  const lastSavedSampleRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLandmarker() {
      try {
        setLoadError(null);
        setModelStatus("Loading hand detector runtime...");
        const visionModule = await import("@mediapipe/tasks-vision");
        const { FilesetResolver, HandLandmarker: HandLandmarkerClass } = visionModule;
        const vision = await FilesetResolver.forVisionTasks(HAND_WASM_PATH);

        let handLandmarker: HandLandmarker;

        try {
          setModelStatus("Loading hand detector model...");
          handLandmarker = await HandLandmarkerClass.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: HAND_MODEL_PATH,
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numHands: 1,
            minHandDetectionConfidence: 0.45,
            minHandPresenceConfidence: 0.45,
            minTrackingConfidence: 0.45,
          });
        } catch (gpuError) {
          setModelStatus("GPU hand detector unavailable. Loading CPU detector...");
          handLandmarker = await HandLandmarkerClass.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: HAND_MODEL_PATH,
            },
            runningMode: "VIDEO",
            numHands: 1,
            minHandDetectionConfidence: 0.45,
            minHandPresenceConfidence: 0.45,
            minTrackingConfidence: 0.45,
          });

          if (process.env.NODE_ENV !== "production") {
            console.warn("MediaPipe GPU delegate failed; using CPU delegate.", gpuError);
          }
        }

        if (!isMounted) {
          return;
        }

        handLandmarkerRef.current = handLandmarker;
        handConnectionsRef.current = HandLandmarkerClass.HAND_CONNECTIONS as Connection[];
        setIsModelReady(true);
        setModelStatus("Hand detector ready.");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unknown model loading error.";
        setLoadError(message);
        setModelStatus("Hand detector failed to load.");
      }
    }

    loadLandmarker();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function stopCamera() {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    motionHistoryRef.current = {};
    lastVideoTimeRef.current = -1;
    setIsCameraActive(false);
    setDetections([]);
    setCameraStatus("Camera is offline.");

    const canvas = overlayRef.current;
    const context = canvas?.getContext("2d");
    context?.clearRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);
  }

  function scheduleFrame() {
    frameRef.current = requestAnimationFrame(processFrame);
  }

  async function recordSample(
    landmarks: NormalizedLandmark[],
    handedness: string,
    samples: MotionSample[]
  ) {
    const sample: CollectedSample = {
      id: `${collectionLabel}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      label: collectionLabel,
      kind: collectionKind,
      timestamp: new Date().toISOString(),
      handedness,
      landmarks: landmarks.map((point) => ({
        x: Number(point.x.toFixed(6)),
        y: Number(point.y.toFixed(6)),
        z: Number(point.z.toFixed(6)),
      })),
      motionTrail: samples.map((point) => ({
        time: Number((point.time - samples[0].time).toFixed(2)),
        x: Number(point.x.toFixed(6)),
        y: Number(point.y.toFixed(6)),
      })),
    };

    setCollectedSamples((current) => [...current, sample]);

    try {
      const response = await fetch("/api/dataset-samples", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(sample),
      });

      if (!response.ok) {
        throw new Error("Dataset save failed.");
      }

      setSavedSampleCount((current) => current + 1);
      setCollectionStatus(
        `Saved ${sample.kind} sample "${sample.label}" to dataset automatically.`
      );
    } catch (error) {
      setCollectionStatus(
        error instanceof Error ? error.message : "Dataset save failed."
      );
    }
  }

  function processFrame() {
    const video = videoRef.current;
    const canvas = overlayRef.current;
    const handLandmarker = handLandmarkerRef.current;

    if (!video || !canvas || !handLandmarker) {
      scheduleFrame();
      return;
    }

    if (video.readyState < 2) {
      scheduleFrame();
      return;
    }

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    if (video.currentTime !== lastVideoTimeRef.current) {
      try {
        const timestamp = video.currentTime * 1000;
        const result = handLandmarker.detectForVideo(video, timestamp);
        const seenIds = new Set<string>();

        const nextDetections = result.landmarks.map((landmarks, index) => {
          const handedness = result.handedness[index]?.[0]?.categoryName ?? "Hand";
          const handId = `${handedness}-${index}`;
          const characterResult = classifyCharacter(landmarks);
          const center = getTrackingCenter(landmarks);
          const existingSamples = motionHistoryRef.current[handId] ?? [];
          const prunedSamples = existingSamples
            .filter((sample) => timestamp - sample.time <= MOTION_HISTORY_MS)
            .slice(-(TRAIL_POINT_LIMIT - 1));
          const samples = [...prunedSamples, { time: timestamp, x: center.x, y: center.y }];

          motionHistoryRef.current[handId] = samples;
          seenIds.add(handId);

          const activeCharacter = characterResult.character ?? lastCharacterDetected?.character ?? null;
          const activeAccuracy = characterResult.character ? characterResult.accuracy : (lastCharacterDetected?.characterAccuracy ?? 0);

          const harakatResult = classifyHarakatMotion(
            samples,
            activeCharacter,
            activeAccuracy,
            characterResult.features
          );

          if (
            collectionMode &&
            index === 0 &&
            lastSavedSampleRef.current !== `${collectionLabel}-${Math.floor(timestamp / 250)}` &&
            (
              (collectionKind === "character" &&
                characterResult.character?.key === collectionLabel &&
                characterResult.accuracy >= CHARACTER_THRESHOLD) ||
              (collectionKind === "harakat" &&
                harakatResult.harakat?.key === collectionLabel &&
                harakatResult.accuracy >= HARAKAT_THRESHOLD)
            )
          ) {
            lastSavedSampleRef.current = `${collectionLabel}-${Math.floor(timestamp / 250)}`;
            void recordSample(landmarks, handedness, samples);
          }

          return {
            id: handId,
            character: characterResult.character,
            characterAccuracy: characterResult.accuracy,
            harakat: harakatResult.harakat,
            harakatAccuracy: harakatResult.accuracy,
            combinedArabic: getCombinedArabic(
              characterResult.character,
              harakatResult.harakat
            ),
            handedness,
            fingerScores: characterResult.fingerScores,
            motionDirection: harakatResult.direction,
          };
        });

        for (const handId of Object.keys(motionHistoryRef.current)) {
          if (!seenIds.has(handId)) {
            delete motionHistoryRef.current[handId];
          }
        }

        drawResults(
          canvas,
          result,
          nextDetections,
          handConnectionsRef.current,
          motionHistoryRef.current
        );
        lastVideoTimeRef.current = video.currentTime;

        if (timestamp - lastUiRefreshRef.current > UI_REFRESH_MS) {
          setDetections(nextDetections);

          const confirmedCharacter = nextDetections.find(
            (item) => item.character && item.characterAccuracy >= CHARACTER_THRESHOLD
          );
          if (confirmedCharacter) {
            setLastCharacterDetected(confirmedCharacter);
          }

          const confirmedHarakat = nextDetections.find(
            (item) =>
              item.character &&
              item.characterAccuracy >= HARAKAT_CHARACTER_THRESHOLD &&
              item.harakat &&
              item.harakatAccuracy >= HARAKAT_THRESHOLD
          );
          if (confirmedHarakat) {
            setLastHarakatDetected(confirmedHarakat);
          }

          setCameraStatus(
            nextDetections.length > 0
              ? "Character detection is live. If the detected sign is clear enough and the motion is clear enough, harakat will appear automatically."
              : "Camera is live. Show a supported character sign."
          );
          lastUiRefreshRef.current = timestamp;
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown detection error.";
        setCameraError(`Detection failed: ${message}`);
        stopCamera();
        return;
      }
    }

    scheduleFrame();
  }

  async function startCamera() {
    if (!isModelReady) {
      setCameraError("The model is not ready yet.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("This browser does not support camera access.");
      return;
    }

    setCameraError(null);
    setCameraStatus("Requesting camera permission...");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      const video = videoRef.current;

      if (!video) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      video.srcObject = stream;
      await video.play();

      setIsCameraActive(true);
      setCameraStatus("Camera is live. Show a supported character sign.");

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      scheduleFrame();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Camera permission failed.";
      setCameraError(message);
      setCameraStatus("Camera could not be started.");
      stopCamera();
    }
  }

  const primaryDetection =
    detections.find((item) => item.harakat) ??
    detections.find((item) => item.character) ??
    detections[0] ??
    null;

  return (
    <main className="min-h-screen bg-[#f7f7f3] text-[#112b33]">
      <header className="sticky top-0 z-50 bg-[#082c3c] text-white shadow-sm">
        <div className="mx-auto flex h-24 w-full max-w-[1440px] items-center gap-6 px-8 lg:px-12">
          <Link
            href="/"
            className="shrink-0 font-[var(--font-display)] text-[26px] font-medium tracking-[-0.04em]"
          >
            SIGMA-Sholat
          </Link>

          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 rounded-md border-white/15 bg-transparent px-5 text-sm text-white hover:bg-white/8 hover:text-white"
              )}
            >
              Home
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 rounded-md border-0 bg-[#00ed64] px-5 text-sm font-semibold text-[#082c3c] hover:bg-[#00d65b]"
              )}
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1440px] px-8 py-16 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f7a51]">
            Arabic detector
          </p>
          <h1 className="mt-4 font-[var(--font-display)] text-4xl leading-tight font-medium tracking-[-0.05em] text-[#102c35] sm:text-5xl">
            Live character and harakat detection from the camera.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4d636b]">
            The detector always reads the base character first. When that base
            character is detected clearly enough and your hand movement is clear
            enough, it also adds Fathah, Kasrah, or Dammah automatically.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_380px]">
          <div className="overflow-hidden rounded-[28px] border border-[#dce4df] bg-white">
            <div className="border-b border-[#dce4df] px-6 py-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f7a51]">
                    Live camera
                  </p>
                  <p className="mt-2 text-base leading-7 text-[#4d636b]">
                    Show one of the supported character signs. Horizontal or
                    downward motion can also trigger harakat.
                  </p>
                </div>
                <div className="rounded-full border border-[#dce4df] bg-[#f8faf8] px-4 py-2 text-sm text-[#26414a]">
                  {isModelReady ? "Model ready" : "Loading model"}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="relative overflow-hidden rounded-2xl border border-[#dce4df] bg-[#082c3c]">
                <div className="aspect-video w-full">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="absolute inset-0 h-full w-full object-cover"
                    style={MIRROR_STYLE}
                  />
                  <canvas
                    ref={overlayRef}
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    style={MIRROR_STYLE}
                  />

                  {!isCameraActive ? (
                    <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-white">
                      <div className="max-w-sm">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-white/15 bg-white/10">
                          <Hand className="size-7 text-[#00ed64]" />
                        </div>
                        <p className="mt-4 text-2xl font-semibold">
                          Camera preview is idle
                        </p>
                        <p className="mt-2 text-sm leading-7 text-white/72">
                          Start the camera, then show a supported character
                          sign. For harakat, move it left-right for Fathah,
                          downward for Kasrah, or curve for Dammah.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={startCamera}
                  disabled={!isModelReady || isCameraActive}
                  className="h-11 rounded-md bg-[#00ed64] px-5 text-sm font-semibold text-[#082c3c] hover:bg-[#00d65b]"
                >
                  <Camera className="mr-2 size-4" />
                  Start camera
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={stopCamera}
                  disabled={!isCameraActive}
                  className="h-11 rounded-md border-[#cfd9d3] px-5 text-sm text-[#102c35]"
                >
                  <CameraOff className="mr-2 size-4" />
                  Stop camera
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCollectionMode((current) => !current)}
                  className="h-11 rounded-md border-[#cfd9d3] px-5 text-sm text-[#102c35]"
                >
                  {collectionMode ? "Stop collecting" : "Collect data"}
                </Button>
              </div>

              <div className="mt-5 rounded-2xl border border-[#dce4df] bg-[#f8faf8] p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f7a51]">
                      Dataset capture
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[#4d636b]">
                      Record landmark samples directly from the live detector and export them as JSON for model training.
                    </p>
                  </div>
                <div className="rounded-full border border-[#dce4df] bg-white px-4 py-2 text-sm text-[#26414a]">
                    {savedSampleCount} saved
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm text-[#26414a]">
                    <span>Collection type</span>
                    <select
                      value={collectionKind}
                      onChange={(event) => {
                        const nextKind = event.target.value as "character" | "harakat";
                        setCollectionKind(nextKind);
                        setCollectionLabel(nextKind === "character" ? "alif" : "fathah");
                      }}
                      className="h-11 rounded-md border border-[#cfd9d3] bg-white px-3"
                    >
                      <option value="character">Character</option>
                      <option value="harakat">Harakat</option>
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm text-[#26414a]">
                    <span>Target label</span>
                    <select
                      value={collectionLabel}
                      onChange={(event) =>
                        setCollectionLabel(event.target.value as CollectionLabel)
                      }
                      className="h-11 rounded-md border border-[#cfd9d3] bg-white px-3"
                    >
                      {collectionKind === "character"
                        ? KNOWN_CHARACTERS.map((item) => (
                            <option key={item.key} value={item.key}>
                              {item.label}
                            </option>
                          ))
                        : KNOWN_HARAKAT.map((item) => (
                            <option key={item.key} value={item.key}>
                              {item.label}
                            </option>
                          ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    onClick={() => {
                      setCollectedSamples([]);
                      setSavedSampleCount(0);
                      lastSavedSampleRef.current = null;
                      setCollectionStatus("Collection cache cleared. Saved files remain in dataset.");
                    }}
                    className="h-11 rounded-md border-[#cfd9d3] px-5 text-sm text-[#102c35]"
                  >
                    Reset counters
                  </Button>
                </div>

                <p className="mt-4 text-sm leading-7 text-[#4d636b]">
                  {collectionMode
                    ? `Collecting ${collectionKind} samples for "${collectionLabel}". Samples are auto-saved into D:\\lidm\\dataset when the live detector confirms that label.`
                    : collectionStatus}
                </p>
                <p className="mt-2 text-sm leading-7 text-[#4d636b]">
                  Status: {collectionStatus}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f7a51]">
                  Character references
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-4">
                  {KNOWN_CHARACTERS.map((item) => (
                    <div
                      key={item.key}
                      className="rounded-2xl border border-[#dce4df] bg-[#f8faf8] p-4"
                    >
                      <div>
                        <p className="text-base font-medium text-[#102c35]">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm text-[#0f7a51]">{item.arabic}</p>
                      </div>
                      <div className="mt-3 overflow-hidden rounded-xl border border-[#dce4df] bg-white">
                        <Image
                          src={item.referenceSrc}
                          alt={`${item.label} reference`}
                          width={420}
                          height={240}
                          className="h-28 w-full object-contain p-3"
                          unoptimized
                        />
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[#4d636b]">
                        Live classification uses the hand landmarks to match
                        this character shape.
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f7a51]">
                  Harakat references
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {KNOWN_HARAKAT.map((item) => (
                    <div
                      key={item.key}
                      className="rounded-2xl border border-[#dce4df] bg-[#f8faf8] p-4"
                    >
                      <div>
                        <p className="text-base font-medium text-[#102c35]">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm text-[#0f7a51]">{item.direction}</p>
                      </div>
                      <div className="mt-3 overflow-hidden rounded-xl border border-[#dce4df] bg-white">
                        <Image
                          src={item.referenceSrc}
                          alt={`${item.label} reference`}
                          width={420}
                          height={240}
                          className="h-40 w-full object-cover object-top"
                          unoptimized
                        />
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[#4d636b]">
                        {item.label === "Fathah"
                          ? "Form a supported character sign, then move the hand horizontally."
                          : item.label === "Kasrah"
                            ? "Form a supported character sign, then move the hand downward."
                            : "Form a supported character sign, then move the hand in a curve downward."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-[#dce4df] bg-white p-6">
              <div className="flex items-center gap-3">
                <ScanSearch className="size-5 text-[#0f7a51]" />
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f7a51]">
                  Live output
                </p>
              </div>

              <div className="mt-5 space-y-3 text-sm leading-7 text-[#4d636b]">
                <p>{modelStatus}</p>
                <p>{cameraStatus}</p>
              </div>

              {loadError ? (
                <div className="mt-4 rounded-2xl border border-[#f0d2d2] bg-[#fff7f7] p-4 text-sm leading-7 text-[#8a3d3d]">
                  Model error: {loadError}
                </div>
              ) : null}

              {cameraError ? (
                <div className="mt-4 rounded-2xl border border-[#f0d2d2] bg-[#fff7f7] p-4 text-sm leading-7 text-[#8a3d3d]">
                  Camera error: {cameraError}
                </div>
              ) : null}

              <div className="mt-5 rounded-2xl bg-[#082c3c] p-5 text-white">
                <p className="text-sm text-white/68">Primary detection</p>
                <p className="mt-2 font-[var(--font-display)] text-4xl">
                  {primaryDetection?.combinedArabic ?? primaryDetection?.character?.arabic ?? "-"}
                </p>
                <p className="mt-2 text-lg">
                  {primaryDetection?.harakat
                    ? `${primaryDetection.character?.label ?? ""} + ${primaryDetection.harakat.label}`
                    : primaryDetection?.character?.label ?? "No supported character detected"}
                </p>
                <p className="mt-1 text-sm text-white/62">
                  {primaryDetection?.harakat
                    ? primaryDetection.motionDirection
                    : "Character confidence must reach at least 80%."}
                </p>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>Character accuracy</span>
                    <span>{primaryDetection?.characterAccuracy.toFixed(1) ?? "0.0"}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#00ed64] transition-[width] duration-300"
                      style={{ width: `${primaryDetection?.characterAccuracy ?? 0}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>Harakat accuracy</span>
                    <span>{primaryDetection?.harakatAccuracy.toFixed(1) ?? "0.0"}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#53b7f2] transition-[width] duration-300"
                      style={{ width: `${primaryDetection?.harakatAccuracy ?? 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#dce4df] bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f7a51]">
                Last detected
              </p>

              <div className="mt-4 rounded-2xl bg-[#082c3c] p-5 text-white">
                <p className="text-sm text-white/68">Last confirmed result</p>
                <div className="mt-2 font-[var(--font-display)] text-4xl leading-tight">
                  {lastHarakatDetected
                    ? lastHarakatDetected.harakat?.key === "fathah" || lastHarakatDetected.harakat?.key === "fathatain"
                      ? (
                        <div className="flex items-center gap-3">
                          <span>{lastHarakatDetected.character?.arabic ?? ""}&#x064E;</span>
                          <span className="text-xl text-white/68">or</span>
                          <span>{lastHarakatDetected.character?.arabic ?? ""}&#x064B;</span>
                        </div>
                      )
                      : lastHarakatDetected.combinedArabic
                    : lastCharacterDetected?.character?.arabic ?? "-"}
                </div>
                <div className="mt-3 text-lg">
                  {lastHarakatDetected
                    ? lastHarakatDetected.harakat?.key === "fathah" || lastHarakatDetected.harakat?.key === "fathatain"
                      ? (
                        <div className="flex flex-col gap-1">
                          <p>• {lastHarakatDetected.character?.label ?? ""} + Fathah</p>
                          <p className="text-sm text-white/68 ml-4">or</p>
                          <p>• {lastHarakatDetected.character?.label ?? ""} + Fathatain</p>
                        </div>
                      )
                      : `${lastHarakatDetected.character?.label ?? ""} + ${lastHarakatDetected.harakat?.label ?? ""}`
                    : lastCharacterDetected?.character?.label ?? "No confirmed detection yet"}
                </div>
                <p className="mt-1 text-sm text-white/62">
                  {lastHarakatDetected?.motionDirection ??
                    (lastCharacterDetected
                      ? "Saved when character confidence reaches at least 80%."
                      : "Needs at least 80% confidence to save a result.")}
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#dce4df] bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f7a51]">
                Detected hands
              </p>

              <div className="mt-4 space-y-3">
                {detections.length > 0 ? (
                  detections.map((detection) => (
                    <div
                      key={detection.id}
                      className="rounded-2xl border border-[#dce4df] bg-[#f8faf8] px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-[#102c35]">
                            {detection.combinedArabic ?? detection.character?.arabic ?? "Detection pending"}
                          </p>
                          <p className="text-sm text-[#4d636b]">
                            {detection.harakat
                              ? `${detection.character?.label ?? ""} shape, ${detection.motionDirection}`
                              : detection.character
                                ? `${detection.character.label} shape`
                                : "Show a supported character sign"}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-[#0f7a51]">
                          {(detection.harakat
                            ? detection.harakatAccuracy
                            : detection.characterAccuracy
                          ).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-[#4d636b]">
                    No hands detected yet.
                  </p>
                )}
              </div>

              <div className="mt-5 rounded-2xl border border-[#dce4df] bg-[#f8faf8] p-4 text-sm leading-7 text-[#4d636b]">
                The detector always reads the character set first. When the
                detected base character is clear enough, horizontal motion maps
                to Fathah, downward motion maps to Kasrah, and curved motion maps to Dammah. Minimum confidence
                is 80%.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
