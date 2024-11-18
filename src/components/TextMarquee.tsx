import React, { useEffect, useState } from 'react';

const TextMarquee = ({
	text,
	animationDuration,
}: {
	text: string;
	animationDuration: string;
}) => {
	return (
		<div className="running-container">
			<div
				className="running"
				style={{
					animation: `marquee-scroll ${animationDuration} linear infinite`,
				}}>
				{/* Nhân đôi nội dung text */}
				<span>{text} &nbsp;&nbsp;</span>
				<span>{text} &nbsp;&nbsp;</span>
				<span>{text} &nbsp;&nbsp;</span>
				<span>{text} &nbsp;&nbsp;</span>
				<span>{text} &nbsp;&nbsp;</span>
			</div>
		</div>
	);
};

export default TextMarquee;
