import type { Assessment, Locale } from "../types";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import messages from "./messages.json" with { type: "json" };
import { coreEnglish } from "../data/core-english";
export const translateError = (s: string, locale = "en") => {
  const parts = s.split(" / ");
  if (
    parts.length === 2 &&
    /[\u4e00-\u9fff]/.test(parts[1]) &&
    !/[\u4e00-\u9fff]/.test(parts[0])
  )
    return locale === "en" ? parts[0] : parts[1];
  return locale === "en" ? messages[s] || s : s;
};
interface LocalizeAssessment {
  (a: Assessment): Assessment;
  (a: Assessment | undefined): Assessment | undefined;
}
interface LocaleContext {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (s: string) => string;
  localizeError: (s: string) => string;
  localizeAssessment: LocalizeAssessment;
}
const Context = createContext<LocaleContext | null>(null);
export function getLocalizedAssessment(
  a: Assessment,
  locale?: Locale,
): Assessment;
export function getLocalizedAssessment(
  a: Assessment | undefined,
  locale?: Locale,
): Assessment | undefined;
export function getLocalizedAssessment(
  a: Assessment | undefined,
  locale: Locale = "en",
) {
  if (!a || locale === "zh") return a;
  const en = a.en || coreEnglish[a.id];
  if (!en) return a;
  return {
    ...a,
    ...en,
    id: a.id,
    contentHash: a.contentHash,
    dimensions: a.dimensions.map((d, i) => ({
      ...d,
      ...en.dimensions?.[i],
      id: d.id,
    })),
    questions: a.questions.map((q, i) => ({
      ...q,
      text:
        typeof en.questions?.[i] === "string"
          ? en.questions[i]
          : en.questions?.[i]?.text || q.text,
    })),
    source: { ...a.source, ...en.source },
  };
}
export function initialLocale(
  hash = globalThis.location?.hash || "",
  search = globalThis.location?.search || "",
  storage?: Pick<Storage, "getItem">,
): Locale {
  const linked =
    new URLSearchParams(hash.split("?")[1] || "").get("lang") ||
    new URLSearchParams(search).get("lang");
  if (linked === "en" || linked === "zh") return linked;
  try {
    return (storage || globalThis.localStorage)?.getItem(
      "test-atlas-language",
    ) === "zh"
      ? "zh"
      : "en";
  } catch {
    return "en";
  }
}
export function replaceLinkedLocale(href: string, locale: Locale): string {
  const url = new URL(href);
  if (url.searchParams.has("lang")) url.searchParams.set("lang", locale);
  const [route, query] = url.hash.split("?");
  const params = new URLSearchParams(query || "");
  if (params.has("lang")) {
    params.set("lang", locale);
    url.hash = route + "?" + params.toString();
  }
  return url.href;
}
export function LocaleProvider({ children }) {
  const navigate = useNavigate();
  const [locale, setState] = useState<Locale>(() => initialLocale());
  const setLocale = (next: Locale) => {
    setState(next);
    try {
      localStorage.setItem("test-atlas-language", next);
    } catch {}
    const nextUrl = new URL(replaceLinkedLocale(location.href, next));
    if (nextUrl.href !== location.href) {
      // Keep the outer URL and HashRouter's location in step, without navigating away.
      history.replaceState(
        history.state,
        "",
        nextUrl.pathname + nextUrl.search + location.hash,
      );
      navigate(nextUrl.hash.slice(1) || "/", { replace: true });
    }
  };
  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
  }, [locale]);
  const t = (s) => (locale === "en" ? messages[s] || s : s);
  return (
    <Context.Provider
      value={{
        locale,
        setLocale,
        t,
        localizeError: (s) => translateError(s, locale),
        localizeAssessment: ((a) =>
          getLocalizedAssessment(a, locale)) as LocalizeAssessment,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useLocale = () => {
  const value = useContext(Context);
  if (!value) throw new Error("LocaleProvider is required");
  return value;
};
