import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    update();
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function MotionScene({ children, sceneKey }: { children: ReactNode; sceneKey: string }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const targets = Array.from(node.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reduced || typeof IntersectionObserver === "undefined") {
      targets.forEach(el => el.dataset.revealState = "visible");
      node.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
      return;
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).dataset.revealState = "visible";
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.05 });
    targets.forEach(el => {
      if (el.dataset.revealState === "visible") return;
      el.dataset.revealState = "pending";
      observer.observe(el);
    });
    const revealFocus = (event: FocusEvent) => {
      let el = event.target as HTMLElement | null;
      while (el && el !== node) {
        if (el.hasAttribute("data-reveal")) el.dataset.revealState = "visible";
        el = el.parentElement;
      }
    };
    node.addEventListener("focusin", revealFocus);
    return () => { observer.disconnect(); node.removeEventListener("focusin", revealFocus); };
  }, [sceneKey, reduced]);
  return <div ref={root} className="route-scene" data-motion={reduced ? "reduced" : "full"}>{children}</div>;
}

export function QuestionStep({ children, question, index }: { children: ReactNode; question: string; index: number }) {
  const root = useRef<HTMLDivElement>(null);
  const previous = useRef(index);
  const reduced = useReducedMotion();
  const direction = index < previous.current ? "backward" : "forward";
  useLayoutEffect(() => {
    const node = root.current;
    if (!node) return;
    const offset = index < previous.current ? -10 : 10;
    previous.current = index;
    if (reduced || typeof node.animate !== "function") return;
    const animation = node.animate([
      { opacity: 0.65, transform: `translateX(${offset}px)` },
      { opacity: 1, transform: "translateX(0)" },
    ], { duration: 220, easing: "cubic-bezier(.22,1,.36,1)" });
    return () => animation.cancel();
  }, [question, index, reduced]);
  return <div ref={root} className="question-step" data-question={question} data-direction={direction}>{children}</div>;
}
