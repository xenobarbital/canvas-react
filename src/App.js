import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';
import beach from './assets/tropical_beach.jpg';

function App() {
  // Main canvas location
  const [x, setX] = useState();
  const [y, setY] = useState();

  // pixel RGB tracking
  const [pixelRgb, setPixelRgb] = useState('Hover your mouse over the image');

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
    const canvasOne = canvasRefOne.current;
    const ctxOne = canvasOne.getContext('2d', { willReadFrequently: true });
    const image = imageRef.current;

    image.addEventListener("load", () => {
      const { width, height } = canvasSize;
      ctxOne.drawImage(image, 0, 0, width, height, 0, 0, width, height);
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

  }, []);

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
      <h1>{pixelRgb}</h1>
      <div className='image'>
        <img ref={imageRef} src={beach} alt="beach"/>
      </div>
      <div className="roundContainer">
        <canvas
          ref={canvasRefTwo}
          className="canvasSmall"
          width="160"
          height="160"
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
