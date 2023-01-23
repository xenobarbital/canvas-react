import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';
import beach from './assets/tropical_beach.jpg';

function App() {
  // Main canvas location
  const [x, setX] = useState();
  const [y, setY] = useState();


  const imageRef = useRef(null);
  const canvasRefOne = useRef(null);

  const canvasSize = useMemo(() => ({
    height: 1080,
    width: 1920,
  }), []);

  // get coordinates of canvas element
  const getCanvasPosition = () => {
    const x = canvasRefOne.current.offsetLeft;
    setX(x);

    const y = canvasRefOne.current.offsetTop;
    setY(y);
  };

  useEffect(() => {
    const canvasOne = canvasRefOne.current;
    const ctxOne = canvasOne.getContext('2d');
    const image = imageRef.current;

    image.addEventListener("load", ({target: img}) => {
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

  // get event coordinates
  const getEventLocation = (element, event) => ({
    x: event.pageX - x,
    y: event.pageY - y,
  })


  // handle pointer hovering over canvas
  const mouseMoveHandle = (e) => {
    const canvasOne = canvasRefOne.current;
    const ctxOne = canvasOne.getContext('2d');
    const eventLocation = getEventLocation(canvasOne, e)
    const { data } = ctxOne.getImageData(eventLocation.x, eventLocation.y, 1, 1);
    console.log('pixel data', data)
  }

  return (
    <>
      <h1>Kek</h1>
      <div className='image'>
        <img ref={imageRef} src={beach} alt="beach"/>
      </div>
      <canvas
        onMouseMove={mouseMoveHandle}
        ref={canvasRefOne}
        className='canvasBig'
        {... canvasSize}
      />
    </>
  );
}

export default App;
