import { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "./Icons";

type LoopVideoProps = {
  src: string;
  poster: string;
  label: string;
};

/**
 * A silent looping clip that only downloads and plays while it's on screen,
 * with a pause button. With reduced motion it waits on its poster until
 * the visitor presses play.
 */
export default function LoopVideo({ src, poster, label }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [reduceMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [playing, setPlaying] = useState(false);
  // Once the visitor pauses (or, with reduced motion, until they press play),
  // scrolling never starts the clip by itself.
  const userControlled = useRef(reduceMotion);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userControlled.current) video.play().catch(() => setPlaying(false));
        } else if (!video.paused) {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userControlled.current = false;
      video.play().catch(() => setPlaying(false));
    } else {
      userControlled.current = true;
      video.pause();
    }
  };

  return (
    <div className="loop-video">
      <video
        ref={ref}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        width="720"
        height="720"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={src} type="video/mp4" />
      </video>
      <button
        type="button"
        className="loop-video__toggle"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
    </div>
  );
}
