import {useEffect, useRef} from 'react';

function QRCode({value, size = 200}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!value || !canvasRef.current) return;

        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;

        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = size;
            canvas.height = size;
            ctx.drawImage(img, 0, 0, size, size);
        };
        img.src = qrUrl;
    }, [value, size]);

    return <canvas ref={canvasRef} style={{width: size, height: size}}/>;
}

export default QRCode;