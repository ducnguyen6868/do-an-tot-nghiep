import { useEffect, useState } from 'react';

export default function useProductsPerRow() {
  const [perRow, setPerRow] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= 1200) setPerRow(4);
      else if (width >= 900) setPerRow(3);
      else if (width >= 600) setPerRow(2);
      else setPerRow(1);
    };

    handleResize(); // gọi 1 lần đầu
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return perRow;
}
