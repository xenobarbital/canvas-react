import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';
import beach from './assets/tropical_beach.jpg';

function App() {
  // Main canvas location
  const [x, setX] = useState();
  const [y, setY] = useState();

  // pixel RGB tracking
  const [pixelRgb, setPixelRgb] = useState('');

  const imageRef = useRef(null);
  const canvasRefOne = useRef(null);
  const canvasRefTwo = useRef(null);

  const canvasSize = useMemo(() => ({
    height: 1080,
    width: 1920,
  }), []);

  // get coordinates of canvas element
  const getCanvasPosition = () => {
    const x = canvasRefOne.current.offsetLeft;
    const y = canvasRefOne.current.offsetTop;
    
    setX(x);
    setY(y);
  };

  useEffect(() => {
    const canvas = canvasRefOne.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const image = imageRef.current;

    image.addEventListener("load", () => {
      const { width, height } = canvasSize;
      ctx.drawImage(image, 0, 0, width, height, 0, 0, width, height);
    });
  }, [canvasSize])

  // get the initial position of canvas in the beginning
  useEffect(() => {
    getCanvasPosition();
  }, []);

  // Re-calculate X and Y of the canvas when the window is resized by the user
  useEffect(() => {
    window.addEventListener("resize", getCanvasPosition);
  }, []);

  useEffect(() => {
    const canvas = canvasRefTwo.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.arc(60, 60, 60, 0, 2 * Math.PI);
    ctx.lineWidth = 10;
    ctx.strokeStyle = pixelRgb ? pixelRgb : '#d9d9d9';
    ctx.stroke();

  }, [pixelRgb, x, y]);

  // get event coordinates
  const getEventLocation = (event) => ({
    x: event.pageX - x,
    y: event.pageY - y,
  })

  // rgb to hex converter
  const rgbToHex = (r, g, b) => {
    if (r > 255 || g > 255 || b > 255)
      // eslint-disable-next-line no-throw-literal
      throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
  } 

  // handle pointer hovering over canvas
  const mouseMoveHandle = (e) => {
    const canvasOne = canvasRefOne.current;
    const ctxOne = canvasOne.getContext('2d');
    const eventLocation = getEventLocation(e);
    const { data } = ctxOne.getImageData(eventLocation.x, eventLocation.y, 1, 1);
    const hex = "#" + ("000000" + rgbToHex(data[0], data[1], data[2])).slice(-6);
    setPixelRgb(hex);
  }

  return (
    <>
      <h1>{pixelRgb ? pixelRgb : 'Hover pointer over the picture'}</h1>
      <div className='image'>
        <img ref={imageRef} src={beach} alt="beach"/>
      </div>
      <div className="roundContainer">
        <canvas
          ref={canvasRefTwo}
          className="canvasSmall"
          width="120"
          height="120"
          />
      </div>
      <canvas
        onMouseMove={mouseMoveHandle}
        ref={canvasRefOne}
        className="canvasBig"
        {... canvasSize}
      />
    </>
  );
}

export default App;
