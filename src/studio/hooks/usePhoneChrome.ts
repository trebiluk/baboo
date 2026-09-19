import { useEffect, useState } from 'react';

/**
 * Phones and short landscape. Chromebook laptops (1280 / 1366) stay
 * desktop chrome even when the trackpad is also a touchscreen.
 */
export function usePhoneChrome(): boolean {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const apply = () => {
      const narrow = window.matchMedia('(max-width: 800px)').matches
        || window.matchMedia('(max-height: 500px)').matches;
      const chromebook = window.matchMedia('(min-width: 1100px)').matches;
      const coarse = window.matchMedia('(pointer: coarse)').matches
        || window.matchMedia('(hover: none)').matches;
      setPhone(narrow || (coarse && !chromebook));
    };
    apply();
    const q = [
      window.matchMedia('(pointer: coarse)'),
      window.matchMedia('(hover: none)'),
      window.matchMedia('(max-width: 800px)'),
      window.matchMedia('(min-width: 1100px)'),
      window.matchMedia('(max-height: 500px)'),
    ];
    q.forEach((mq) => mq.addEventListener('change', apply));
    window.addEventListener('resize', apply);
    return () => {
      q.forEach((mq) => mq.removeEventListener('change', apply));
      window.removeEventListener('resize', apply);
    };
  }, []);
  return phone;
}
