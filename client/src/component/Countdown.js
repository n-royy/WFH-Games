import React, { useState, useRef, useEffect } from 'react';

const CountDown = ({ sumarry }) => {
  const [num, setNum] = useState(60);
  let intervalRef = useRef();
  const decreaseNum = () => setNum((prev) => prev - 1);
  useEffect(() => {
    intervalRef.current = setInterval(decreaseNum, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);
  if (num === 0) {
    clearInterval(intervalRef.current);
    sumarry();
  }
  return <span className='ml-3'>00:{num}</span>;
};

export default CountDown;
