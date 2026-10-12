import React, { useRef, useEffect, useState } from "react";

interface CanvasTextProps {
  text: string;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  lineHeight?: number;
  className?: string;
}

export function CanvasText({
  text,
  fontSize = 16,
  fontWeight = "500",
  fontFamily = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  color = "#0f172a",
  lineHeight = 1.45,
  className = ""
}: CanvasTextProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(containerRef.current);
    window.addEventListener("resize", updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || containerWidth <= 0 || !text) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    const width = containerWidth;
    const fontSpec = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.font = fontSpec;

    // Word wrap calculation
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > width - 8 && currentLine !== "") {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    const lineGap = fontSize * lineHeight;
    const totalHeight = Math.max(lines.length * lineGap + 8, fontSize + 8);

    // Set canvas dimensions with DPR scaling
    canvas.width = width * dpr;
    canvas.height = totalHeight * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${totalHeight}px`;

    ctx.scale(dpr, dpr);
    ctx.textBaseline = "top";
    ctx.font = fontSpec;
    ctx.fillStyle = color;

    lines.forEach((line, idx) => {
      ctx.fillText(line, 2, idx * lineGap + 2);
    });
  }, [text, containerWidth, fontSize, fontWeight, fontFamily, color, lineHeight]);

  return (
    <div ref={containerRef} className={`w-full relative select-none pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="block w-full select-none pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
