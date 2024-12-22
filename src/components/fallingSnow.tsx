'use client';

import { useEffect } from 'react';

export default function FallingSnow() {
	useEffect(() => {
		const draw = () => {
			const container = document.querySelector('.falling-snow');
			const e = document.createElement('div');
			e.classList.add('star-snow');
			container?.appendChild(e);
			e.style.left = `${Math.random() * window.innerWidth}px`;
			e.style.fontSize = `${Math.random() * 24}px`;
			e.style.animationDuration = `${Math.random() * 3 + 2}s`;
			setTimeout(() => {
				container?.removeChild(e);
			}, 5000);
		};
		let loop_falling_snow = setInterval(() => {
			draw();
		}, 100);
		return () => {
			clearInterval(loop_falling_snow);
		};
	}, []);
	return <div className="falling-snow pointer-events-none z-50"></div>;
}
