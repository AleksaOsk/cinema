import {useEffect, useRef, useState} from 'react';

export function useScaledSeats(deps = []) {
    const containerRef = useRef(null);
    const [seatSize, setSeatSize] = useState(26);

    useEffect(() => {
        const calculateSize = () => {
            if (!containerRef.current) return;

            const rows = containerRef.current.querySelectorAll('.admin-seats-row');
            if (rows.length === 0) return;

            let maxSeats = 0;
            rows.forEach(row => {
                maxSeats = Math.max(maxSeats, row.children.length);
            });

            if (maxSeats === 0) return;

            const containerWidth = containerRef.current.clientWidth - 40;

            const gap = maxSeats > 30 ? 2 : (maxSeats > 20 ? 4 : 8);

            const totalGaps = (maxSeats - 1) * gap;
            const availableWidth = containerWidth - totalGaps;

            let newSize = Math.floor(availableWidth / maxSeats);

            newSize = Math.min(newSize, 26);
            newSize = Math.max(newSize, 8);

            setSeatSize(newSize);
        };

        calculateSize();

        const resizeObserver = new ResizeObserver(() => calculateSize());
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        window.addEventListener('resize', calculateSize);

        return () => {
            window.removeEventListener('resize', calculateSize);
            resizeObserver.disconnect();
        };
    }, deps);

    return {containerRef, seatSize};
}