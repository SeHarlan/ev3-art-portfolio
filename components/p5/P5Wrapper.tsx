import { useRef, useEffect, FC, memo, MutableRefObject, useState } from 'react';
import p5, { Renderer } from 'p5';
import debounce from 'lodash.debounce';
import { useWindowsContext } from '@/context/WindowsProvider';

interface P5WrapperProps {
  sketch: (p: p5, seed?: string | null) => void;
  seed: string | undefined;
}


const P5Wrapper: FC<P5WrapperProps> = ({ sketch, seed }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const initializeRef = useRef(false);
  const initialDimensions = useRef({ width: 0, height: 0 });

  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    let cleanUp: any;
    let observer: ResizeObserver;

    if (containerRef?.current && initialized) {
      initialDimensions.current = {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      };
      

      const enhancedSketch = (p: p5) => {
        cleanUp = sketch(p, seed || null);

        function isTouchEventInside(event: any) {
    
          if (!containerRef.current) return false;
          const { left, top } = containerRef.current.getBoundingClientRect();
          const width = containerRef.current.clientWidth
          const height = containerRef.current.clientHeight
          const touchX = event?.clientX || -10000;
          const touchY = event?.clientY || -10000;
          const isInside = touchX >= left && touchX <= left + width && touchY >= top && touchY <= top + height;
          if (isInside) {
            // event.preventDefault();
            event.stopPropagation();
          }
          return isInside;
        }

        // Override p5's default mouse and touch event handlers
        const originalMousePressed = p.mousePressed;
        p.mousePressed = (...args) => {
          if (isTouchEventInside(...args)) return originalMousePressed?.apply(p, args);
        };
        
        const originalMouseReleased = p.mouseReleased;
        p.mouseReleased = (...args) => { 
          if (isTouchEventInside(...args)) return originalMouseReleased?.apply(p, args);
        }

        const originalMouseDragged = p.mouseDragged;
        p.mouseDragged = (...args) => {
          if (isTouchEventInside(...args)) return originalMouseDragged?.apply(p, args);
        }

        const originalTouchStarted = p.touchStarted;
        p.touchStarted = (...args) => {
          if (isTouchEventInside(...args)) return originalTouchStarted?.apply(p, args);
        };
        const originalTouchEnded = p.touchEnded;
        p.touchEnded = (...args) => {
          if (isTouchEventInside(...args)) return originalTouchEnded?.apply(p, args);
        };

        const originalTouchMoved = p.touchMoved;
        p.touchMoved = (...args) => {
          if (isTouchEventInside(...args)) return originalTouchMoved?.apply(p, args);
        };
      };

      const makeCanvas = () => {
        if (containerRef.current) {
          p5InstanceRef.current?.remove();
          const p5Instance = new p5(enhancedSketch, containerRef.current);
          p5InstanceRef.current = p5Instance;

          
        }
      };

      makeCanvas();

      // setTimeout(() => {
      //   initializeRef.current = true;
      // }, 1000)

      const resizeDebounced = debounce(() => {
        // cleanUp && cleanUp();
        // initializeRef.current && makeCanvas()

        const canvas = containerRef.current?.querySelector('canvas')
        if (canvas && containerRef.current) {
          const width = containerRef.current.clientWidth
          const height = containerRef.current.clientHeight
          const widthScale = width / initialDimensions.current.width;
          const heightScale = height / initialDimensions.current.height;
          const scale = Math.min(widthScale, heightScale);
          canvas.style.transformOrigin = 'top left';
          canvas.style.transform = `scale(${scale*100}%)`
        }
      }, 200);
   
      // Create a ResizeObserver to listen for changes in container size
      observer = new ResizeObserver(resizeDebounced);
      observer.observe(containerRef.current);

    } 

    setInitialized(true)

    return () => {
      cleanUp && cleanUp();
      observer && observer.disconnect();
      p5InstanceRef.current?.remove();
    };
  }, [sketch, seed, initialized]);

  return <div ref={containerRef} style={{
    width: '100%',
    height: '100%',
  }} />;
};


export default P5Wrapper;