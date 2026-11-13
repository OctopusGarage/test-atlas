import { characterTopics, roleSvg } from "../engine/presentation";
import { leadingDimensions } from "../engine/insights";
import { translateError } from "../i18n";
import QRCode from "qrcode";
export const publicLink = (id, locale = "en") =>
  `https://octopusgarage.github.io/test-atlas/#/tests/${encodeURIComponent(id)}?lang=${locale}`;
export function cardLayout(
  dimensionCount: number,
  includeScores: boolean,
  character = false,
) {
  const height =
    1350 +
    (includeScores ? Math.max(0, dimensionCount - 5) * 105 : 0) +
    (includeScores && character ? 330 : 0);
  return { height, qrTop: height - 330, footer: height - 50 };
}
export async function downloadCard(
  assessment,
  result,
  includeScores,
  locale = "en",
) {
  const t = (en, zh) => (locale === "en" ? en : zh);
  const c = document.createElement("canvas");
  c.width = 1080;
  const character = characterTopics.has(assessment.id);
  const layout = cardLayout(
    assessment.dimensions.length,
    includeScores,
    character,
  );
  c.height = layout.height;
  const ctx = c.getContext("2d");
  if (!ctx) throw Error(translateError("当前浏览器不支持图片导出", locale));
  ctx.fillStyle = "#f7f6f2";
  ctx.fillRect(0, 0, 1080, layout.height);
  ctx.fillStyle = "#244c3c";
  ctx.font = "26px sans-serif";
  ctx.fillText("✳  TEST ATLAS", 80, 95);
  ctx.font = "20px sans-serif";
  ctx.fillText("A LITTLE CURIOSITY. A NEW PERSPECTIVE.", 80, 150);
  ctx.font = "bold 66px sans-serif";
  ctx.fillText(assessment.name, 80, 290, 920);
  ctx.font = "28px sans-serif";
  ctx.fillText(assessment.tagline, 80, 355, 920);
  let y = 450;
  const paintPortrait = async (
    id: string,
    x: number,
    top: number,
    size: number,
  ) => {
    const picture = new Image();
    picture.src =
      "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(roleSvg(assessment.id, id));
    await picture.decode();
    ctx.drawImage(picture, x, top, size, size);
  };
  if (character && includeScores) {
    const leaders = leadingDimensions(assessment, result);
    const shown = leaders.length === 1 ? leaders : assessment.dimensions;
    const size = shown.length === 1 ? 230 : 170;
    for (let i = 0; i < shown.length; i++) {
      const d = shown[i],
        x = shown.length === 1 ? 425 : 125 + i * 300;
      await paintPortrait(d.id, x, 400, size);
      ctx.fillStyle = "#244c3c";
      ctx.font = "22px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(d.name, x + size / 2, 400 + size + 35, 280);
    }
    ctx.textAlign = "left";
    y += 330;
  }

  if (includeScores) {
    for (const d of assessment.dimensions) {
      ctx.fillStyle = "#244c3c";
      ctx.font = "27px sans-serif";
      ctx.fillText(d.name, 80, y, 700);
      ctx.fillText(`${Math.round(result.scores[d.id])} / 100`, 820, y);
      ctx.fillStyle = "#e2e4db";
      ctx.fillRect(80, y + 22, 920, 10);
      ctx.fillStyle = "#52785c";
      ctx.fillRect(80, y + 22, (920 * result.scores[d.id]) / 100, 10);
      y += 105;
    }
  } else {
    ctx.font = "42px sans-serif";
    ctx.fillText(
      t("You are more than any label.", "你比任何一个标签都丰富。"),
      80,
      530,
    );
    ctx.font = "28px sans-serif";
    ctx.fillText(
      t(
        "Take time to discover your many sides.",
        "给自己一点时间，发现不同的侧面。",
      ),
      80,
      600,
    );
    if (character) {
      for (let i = 0; i < assessment.dimensions.length; i++)
        await paintPortrait(
          assessment.dimensions[i].id,
          125 + i * 300,
          700,
          170,
        );
    } else {
      ctx.strokeStyle = "#a4b49f";
      for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.ellipse(530, 800, 180, 75, (i * Math.PI) / 9, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }
  const qr = await QRCode.toDataURL(publicLink(assessment.id, locale), {
    width: 256,
    margin: 4,
    color: { dark: "#244c3c", light: "#f7f6f2" },
  });
  const image = new Image();
  image.src = qr;
  await image.decode();
  ctx.drawImage(image, 80, layout.qrTop, 256, 256);
  ctx.fillStyle = "#244c3c";
  ctx.font = "26px sans-serif";
  ctx.fillText(
    t("Follow curiosity. Discover yourself.", "循着好奇，认识自己。"),
    380,
    layout.qrTop + 50,
  );
  ctx.font = "20px sans-serif";
  ctx.fillText(
    t("Scan to explore \u00b7 No account needed", "扫码开启探索 · 无需注册"),
    380,
    layout.qrTop + 95,
  );
  ctx.font = "18px sans-serif";
  ctx.fillText(
    includeScores
      ? t(
          "Scale positions, not population rankings. For self reflection.",
          "分数为题目刻度位置，并非人群排名。结果用于自我探索。",
        )
      : t(
          "Exploration card \u00b7 No personal scores or answers",
          "通用探索卡 · 未包含个人分数或答案",
        ),
    80,
    layout.footer,
  );
  const blob = await new Promise<Blob | null>((resolve) =>
    c.toBlob(resolve, "image/png"),
  );
  if (!blob) throw Error(translateError("图片生成失败，请重试", locale));
  const url = URL.createObjectURL(blob),
    link = document.createElement("a");
  link.download = `test-atlas-${assessment.id}.png`;
  link.href = url;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
