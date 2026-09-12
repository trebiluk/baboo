import { useEffect, useState } from 'react';

/** Phones, short landscape, and “desktop Chrome inside a phone” — hover rails poison those. */
export function usePhoneChrome(): boolean {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const apply = () => {
      setPhone(
        window.matchMedia('(pointer: coarse)').matches
        || window.matchMedia('(hover: none)').matches
        || window.matchMedia('(max-width: 800px)').matches
        || window.matchMedia('(max-height: 500px)').matches,
      );
    };
    apply();
    const q = [
      window.matchMedia('(pointer: coarse)'),
      window.matchMedia('(hover: none)'),
      window.matchMedia('(max-width: 800px)'),
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
