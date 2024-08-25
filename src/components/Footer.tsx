import React from 'react';

const Footer = () => {
	return (
		<footer className="footer footer-center bg-base-300 lg:text-base-content text-sm p-4">
			<aside>
				<p>
					Copyright © {new Date().getFullYear()} - All right reserved by
					HSGAME.ME
				</p>
			</aside>
		</footer>
	);
};

export default Footer;
