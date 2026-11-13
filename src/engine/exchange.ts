import { isCompatible } from "./insights";
import type { ScoreAssessment, ScoreResult } from "./insights";
export type SharedResult = ScoreResult & { schema: "test-atlas-result/1" };
const fields = [
  "schema",
  "testId",
  "testVersion",
  "scoringVersion",
  "reportVersion",
  "contentHash",
  "scores",
];
export const MAX_RESULT_BYTES = 65536;
export function decodeResult(
  text: string,
  assessments: ScoreAssessment[],
): SharedResult {
  if (
    typeof text !== "string" ||
    new TextEncoder().encode(text).length > MAX_RESULT_BYTES
  )
    throw Error("Result file must be at most 64 KiB. / 文件不能超过 64 KiB。");
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    throw Error("Invalid JSON result file. / JSON 文件无效。");
  }
  if (
    !value ||
    Array.isArray(value) ||
    typeof value !== "object" ||
    Object.keys(value).length !== fields.length ||
    Object.keys(value).some((k) => !fields.includes(k)) ||
    value.schema !== "test-atlas-result/1"
  )
    throw Error("Unsupported result format. / 不支持的结果格式。");
  const a = assessments.find((a) => a.id === value.testId);
  if (!a || !isCompatible(a, value))
    throw Error(
      "Result is invalid or uses another version. / 结果无效或版本不同。",
    );
  return Object.fromEntries(
    fields.map((k) => [
      k,
      k === "scores"
        ? Object.fromEntries(
            a.dimensions.map((d) => [d.id, value.scores[d.id]]),
          )
        : value[k],
    ]),
  ) as SharedResult;
}
export function encodeResult(a: ScoreAssessment, r: ScoreResult) {
  const data = {
    schema: "test-atlas-result/1",
    testId: r.testId,
    testVersion: r.testVersion,
    scoringVersion: r.scoringVersion,
    reportVersion: r.reportVersion,
    contentHash: r.contentHash,
    scores: Object.fromEntries(a.dimensions.map((d) => [d.id, r.scores[d.id]])),
  };
  return JSON.stringify(decodeResult(JSON.stringify(data), [a]), null, 2);
}
export function downloadResult(a: ScoreAssessment, r: ScoreResult) {
  const url = URL.createObjectURL(
    new Blob([encodeResult(a, r)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `test-atlas-${a.id}-result.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
