import { createCanvas } from "canvas";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export interface FileMetadata {
  fileName?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  fontSize?: number;
  fontFamily?: string[];
  subtitleLineCount?: number;
}

async function asciiToPng(ascii: string, options?: FileMetadata) {
  const {
    fileName = "artwork/alex-c-line",
    width = 3000,
    height = 3000,
    backgroundColor = "#0b1020",
    titleColor = "#facc15",
    subtitleColor = "#22c55e",
    fontSize = 48,
    fontFamily = ["Menlo", "Monaco", "Consolas", "monospace"],
    subtitleLineCount = 1,
  } = options ?? {};

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, width, height);

  context.font = `${fontSize}px ${fontFamily.join(", ")}`;
  context.textBaseline = "top";

  const lines = ascii.split("\n");

  const lineHeight = fontSize * 1.4;
  const blockHeight = lines.length * lineHeight;
  const startY = (height - blockHeight) / 2;

  const subtitleStartIndex = Math.max(0, lines.length - subtitleLineCount);

  lines.forEach((line, index) => {
    context.fillStyle = index >= subtitleStartIndex ? subtitleColor : titleColor;

    const metrics = context.measureText(line);
    const x = (width - metrics.width) / 2;
    const y = startY + index * lineHeight;

    context.fillText(line, x, y);
  });

  const outputPath = path.resolve(fileName.endsWith(".png") ? fileName : `${fileName}.png`);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, canvas.toBuffer("image/png"));
}

export default asciiToPng;
