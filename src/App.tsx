import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

interface IHTMLCanvasElement extends HTMLCanvasElement {
  frameCount: number;
}

const App = () => {
  const canvasRef = useRef<IHTMLCanvasElement>(null);
  const [width, setWidth] = useState<number>(1158);
  const [height, setHeight] = useState<number>(770);
  const html = document.documentElement;

  const currentFrame = (index: number) => {
    return `${process.env.PUBLIC_URL}/background/${index
      .toString()
      .padStart(4, '0')}.jpg`;
  };

  const updateImage = useCallback((index: number) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: IHTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    const canvasImage = new Image();

    canvasImage.src = currentFrame(index);
    if (context) {
      context.drawImage(canvasImage, 0, 0, 1158, 770);
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: IHTMLCanvasElement = canvasRef.current;
    canvas.frameCount = 150;
    const context = canvas.getContext('2d');
    const canvasImage = new Image();

    window.addEventListener('scroll', () => {
      const { scrollTop } = html;
      const maxScrollTop = html.scrollHeight - window.innerHeight;
      const scrollFraction = scrollTop / maxScrollTop;
      const frameIndex = Math.min(
        canvas.frameCount - 1,
        Math.ceil(scrollFraction * canvas.frameCount),
      );
      requestAnimationFrame(() => {
        canvasImage.src = currentFrame(frameIndex + 1);
        if (context) {
          canvasImage.onload = () => {
            context.drawImage(canvasImage, 0, 0, 1158, 770);
          };
        }
      });
    });
  }, [html, updateImage]);

  return (
    <canvas ref={canvasRef} width={width} height={height} className="canvas" />
  );
};

export default App;
