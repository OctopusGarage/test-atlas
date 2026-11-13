import type { Assessment, Dimension, Result } from "../types";
export type ScoreResult = Pick<
  Result,
  | "testId"
  | "testVersion"
  | "scoringVersion"
  | "reportVersion"
  | "contentHash"
  | "scores"
>;
export type ScoreAssessment<
  D extends Pick<Dimension, "id"> = Pick<Dimension, "id">,
> = Pick<
  Assessment,
  "id" | "version" | "scoringVersion" | "reportVersion" | "contentHash"
> & { dimensions: D[] };
export const resultTime = (value?: string) => Date.parse(value || "") || 0;
export function isCompatible(
  a: ScoreAssessment | undefined,
  r: ScoreResult | undefined,
): boolean {
  return (
    !!a &&
    !!r &&
    r.testId === a.id &&
    r.testVersion === a.version &&
    r.scoringVersion === a.scoringVersion &&
    r.reportVersion === a.reportVersion &&
    r.contentHash === a.contentHash &&
    !!r.scores &&
    typeof r.scores === "object" &&
    !Array.isArray(r.scores) &&
    Object.keys(r.scores).length === a.dimensions.length &&
    a.dimensions.every(
      (d) =>
        Object.hasOwn(r.scores, d.id) &&
        Number.isFinite(r.scores[d.id]) &&
        r.scores[d.id] >= 0 &&
        r.scores[d.id] <= 100,
    )
  );
}
export function leadingDimensions<D extends Pick<Dimension, "id">>(
  a: ScoreAssessment<D>,
  r: ScoreResult,
): D[] {
  if (!isCompatible(a, r)) return [];
  const top = Math.max(...a.dimensions.map((d) => r.scores[d.id]));
  return a.dimensions.filter((d) => Math.abs(r.scores[d.id] - top) < 1e-8);
}
export function compareResults<D extends Pick<Dimension, "id">>(
  a: ScoreAssessment<D>,
  first: ScoreResult,
  second: ScoreResult,
) {
  if (!isCompatible(a, first) || !isCompatible(a, second))
    throw Error(
      "These results use different assessment versions. / 结果版本不一致。",
    );
  return a.dimensions.map((d) => ({
    ...d,
    first: first.scores[d.id],
    second: second.scores[d.id],
    difference: second.scores[d.id] - first.scores[d.id],
  }));
}
export function latestResults<R extends ScoreResult & { completedAt?: string }>(
  assessments: ScoreAssessment[],
  results: R[],
): R[] {
  return assessments.flatMap((a) => {
    const matches = results
      .filter((r) => isCompatible(a, r))
      .sort((x, y) => resultTime(y.completedAt) - resultTime(x.completedAt));
    return matches.length ? [matches[0]] : [];
  });
}
export function recommendAssessments<
  A extends ScoreAssessment & { category?: string },
>(assessments: A[], results: ScoreResult[], limit = 3): A[] {
  const done = new Set(
    assessments
      .filter((a) => results.some((r) => isCompatible(a, r)))
      .map((a) => a.id),
  );
  const remaining = assessments.filter((a) => !done.has(a.id));
  const selected: A[] = [];
  const categories = new Set<string | undefined>();
  for (const a of remaining) {
    if (!categories.has(a.category)) {
      selected.push(a);
      categories.add(a.category);
    }
  }
  for (const a of remaining) {
    if (!selected.includes(a)) selected.push(a);
  }
  return selected.slice(0, Math.max(0, limit));
}
