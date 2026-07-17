import { useEffect, useState } from 'react';

export default function useCustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailPosition, setTrailPosition] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [magneticElement, setMagneticElement] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      if (magneticElement) {
        const rect = magneticElement.getBoundingClientRect();
        const center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        // Pull the trail towards the center of the magnetic element
        setTrailPosition({
          x: center.x + (e.clientX - center.x) * 0.35,
          y: center.y + (e.clientY - center.y) * 0.35,
        });
      } else {
        setTrailPosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, input, select, textarea, [data-hover-glow]');
      if (target) {
        setHovered(true);
        if (target.classList.contains('magnetic-btn') || target.closest('.magnetic-btn')) {
          setMagneticElement(target.closest('.magnetic-btn') || target);
        }
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, input, select, textarea, [data-hover-glow]');
      if (target) {
        setHovered(false);
        setMagneticElement(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [magneticElement]);

  useEffect(() => {
    if (!magneticElement) return;
    const element = magneticElement;
    
    const handleMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      // pull the element by 20% of distance
      element.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    };
    
    const handleLeave = () => {
      element.style.transform = 'translate(0px, 0px)';
    };

    element.addEventListener('mousemove', handleMove);
    element.addEventListener('mouseleave', handleLeave);

    return () => {
      element.removeEventListener('mousemove', handleMove);
      element.removeEventListener('mouseleave', handleLeave);
      element.style.transform = '';
    };
  }, [magneticElement]);

  return { position, trailPosition, clicked, hovered };
}
