import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import html2canvas from "html2canvas";
import logo from "@/assets/logo.png";
import preloaderSound from "@/assets/preloader-sound.mp3";

type PreloaderDustProps = {
  onDone: () => void;
};

const COUNT = 75;
const REPEAT_COUNT = 3;

export default function PreloaderDust({ onDone }: PreloaderDustProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const captureRef = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(false); // ✅ removed entryRef and handleEnter

  useEffect(() => {
    if (!started) return;

    const root = rootRef.current;
    const capture = captureRef.current;
    if (!root || !capture) return;

    const audio = new Audio(preloaderSound);
    audio.volume = 1.0;
    audio.play();

    let canvases: HTMLCanvasElement[] = [];
    let doneCalled = false;

    function clearCanvases() {
      canvases.forEach((c) => c.remove());
      canvases = [];
      gsap.killTweensOf(".capture-canvas");
    }

    function finish() {
      if (doneCalled) return;
      doneCalled = true;
      gsap.to(audio, { volume: 0, duration: 0.25, onComplete: () => audio.pause() });
      gsap.to(root, { duration: 0.25, opacity: 0, ease: "power2.out", onComplete: onDone });
    }

    function runDust() {
      clearCanvases();
      capture.style.position = "fixed";
      capture.style.left = "-9999px";
      capture.style.top = "-9999px";
      capture.style.display = "block";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          html2canvas(capture, { useCORS: true, allowTaint: true, scale: 1 }).then((canvas) => {
            capture.style.display = "none";
            const width = canvas.width;
            const height = canvas.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const imageData = ctx.getImageData(0, 0, width, height);
            const dataList: ImageData[] = [];

            for (let i = 0; i < COUNT; i++) dataList.push(ctx.createImageData(width, height));

            for (let x = 0; x < width; x++) {
              for (let y = 0; y < height; y++) {
                for (let l = 0; l < REPEAT_COUNT; l++) {
                  const index = (x + y * width) * 4;
                  const dataIndex = Math.floor((COUNT * (Math.random() + (2 * x) / width)) / 3);
                  if (dataIndex < COUNT) {
                    for (let p = 0; p < 4; p++) {
                      dataList[dataIndex].data[index + p] = imageData.data[index + p];
                    }
                  }
                }
              }
            }

            dataList.forEach((data, i) => {
              const cloned = canvas.cloneNode() as HTMLCanvasElement;
              const clonedCtx = cloned.getContext("2d");
              clonedCtx?.putImageData(data, 0, 0);
              cloned.className = "capture-canvas";
              root.appendChild(cloned);
              canvases.push(cloned);

              const randomAngle = (Math.random() - 0.5) * 2 * Math.PI;
              const randomRotationAngle = 30 * (Math.random() - 0.5);

              gsap.fromTo(
                cloned,
                { rotate: randomRotationAngle, x: 40 * Math.sin(randomAngle), y: 40 * Math.cos(randomAngle), opacity: 0 },
                {
                  duration: 2.3,
                   rotate: 0, x: 0, y: 0, opacity: 1,
                  delay: (i / dataList.length) * 1.8,
                  ease: "power2.out",
                  onComplete: i === dataList.length - 1 ? finish : undefined,
                },
              );
            });
          });
        });
      });
    }

    runDust();

    return () => {
      clearCanvases();
      gsap.killTweensOf(root);
      audio.pause();
      audio.src = "";
    };
  }, [started, onDone]);

  return (
    <div ref={rootRef} className="preloader-overlay" aria-label="Loading">
      {!started && (
        <button
          onClick={() => setStarted(true)} // ✅ directly sets started, no handleEnter needed
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 40%, #f5f0ff 70%, #ede8ff 100%)",
            color: "#7c3aed",
            border: "none",
            cursor: "pointer",
            fontSize: "1.5rem",
            fontWeight:"700",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            zIndex: 9999,
          }}
        >
          Click to Enter
        </button>
      )}

      <div
        ref={captureRef}
        className="preloader-capture"
        style={{ display: "none" }}
        aria-hidden
      >
        <img
          src={logo}
          alt="CuraNex"
          draggable={false}
          style={{ width: "868px", height: "auto" }}
        />
      </div>
    </div>
  );
}