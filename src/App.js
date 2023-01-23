import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';
import beach from './assets/tropical_beach.jpg';

function App() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const imageRef = useRef(null);
  const canvasRefOne = useRef(null);

  const canvasSize = useMemo(() => ({
    height: height > 4000 ? 4000 : height,
    width: width > 4000 ? 4000 : width,
  }), [height, width]);

  useEffect(() => {
    const canvasOne = canvasRefOne.current;
    const ctxOne = canvasOne.getContext('2d');
    const image = imageRef.current;

    image.addEventListener("load", ({target: img}) => {
      setHeight(img.height);
      setWidth(img.width);

      ctxOne.drawImage(image, 0, 0, width, height, 0, 0, width, height);
    });
  }, [height, width])

  return (
    <>
      <h1>Kek</h1>
      <div className='image'>
        <img ref={imageRef} src={beach} alt="beach"/>
      </div>
      <canvas
        ref={canvasRefOne}
        className='canvasBig'
        {... canvasSize}
      />
    </>
  );
}

export default App;
