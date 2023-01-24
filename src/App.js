import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';
import beach from './assets/tropical_beach.jpg';
import icon from './assets/IconColorPicker.svg';

function App() {
  // Main canvas location
  const [x, setX] = useState();
  const [y, setY] = useState();

  // pixel RGB tracking
  const [pixelRgb, setPixelRgb] = useState('');

  // toggle picker
  const [enabled, setEnabled] = useState(false);

  const imageRef = useRef(null);
  const canvasRefOne = useRef(null);
  const canvasRefTwo = useRef(null);

  const canvasSize = useMemo(() => ({
    height: 1080,
    width: 1920,
  }), []);

  // get coordinates of canvas element
  const getCanvasPosition = () => {
    setX(canvasRefOne.current.offsetLeft);
    setY(canvasRefOne.current.offsetTop);
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
    ctx.fillStyle = (pixelRgb && enabled) ? pixelRgb : '#d9d9d9';
    ctx.fillRect(0, 0, 60, 60);

  }, [enabled, pixelRgb, x, y]);

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
    if (enabled) {
      const canvasOne = canvasRefOne.current;
      const ctxOne = canvasOne.getContext('2d');
      const eventLocation = getEventLocation(e);
      const { data } = ctxOne.getImageData(eventLocation.x, eventLocation.y, 1, 1);
      const hex = "#" + ("000000" + rgbToHex(data[0], data[1], data[2])).slice(-6);
      setPixelRgb(hex);
    }
  }

  const handlePicker = () => {
    setEnabled(!enabled);
  }

  return (
    <>
      <div className="topContainer">
        <label title="Click to enable picker tool">
          <img className="pickerIcon" src={icon} alt="picker" />
          <input type="checkbox" onChange={handlePicker} />
        </label>
        <div className="divRight">
          <p>{pixelRgb && enabled ? pixelRgb : ''}</p>
          <div className="indicatorContainer">
            <canvas
              ref={canvasRefTwo}
              className="canvasSmall"
              width="60"
              height="60"
              />
          </div>
        </div>
      </div>
      
      <div className='image'>
        <img ref={imageRef} src={beach} alt="beach"/>
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
