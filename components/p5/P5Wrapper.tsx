import { useRef, useEffect, FC, useState } from 'react';
import p5, { Renderer } from 'p5';
import debounce from 'lodash.debounce';

interface P5WrapperProps {
  sketch: (p: p5) => void;
}



const P5Wrapper: FC<P5WrapperProps> = ({ sketch }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  const initializeRef = useRef(false);

  useEffect(() => {
    let cleanUp: any;

    if (containerRef && containerRef.current) {
      const enhancedSketch = (p: p5) => {
        cleanUp = sketch(p);

        function isTouchEventInside(event: any) {
          event.preventDefault();
          event.stopPropagation();
          if (!containerRef.current) return false;
          const { left, top } = containerRef.current.getBoundingClientRect();
          const width = containerRef.current.clientWidth
          const height = containerRef.current.clientHeight
          // const touchX = p.mouseX
          // const touchY = p.mouseY
          const touchX = event?.clientX || event.touches?.[0].clientX;
          const touchY = event?.clientY || event.touches?.[0].clientY;
          return touchX >= left && touchX <= left + width && touchY >= top && touchY <= top + height;
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

      setTimeout(() => {
        initializeRef.current = true;
      }, 1000)

      const resizeDebounced = debounce(() => {
        initializeRef.current && makeCanvas()
      }, 200);
   
      // Create a ResizeObserver to listen for changes in container size
      const observer = new ResizeObserver(resizeDebounced);
      observer.observe(containerRef.current);

      return () => {
        cleanUp && cleanUp();
        observer.disconnect();
        p5InstanceRef.current?.remove();
      };
    }
  }, [sketch]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};


export default P5Wrapper;