import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			transitionProperty: {
				wh: 'height,width',
				spacing: 'margin, padding',
			},
			animation: {
				'flip-vertical-right':
					'flip-vertical-right 0.4s cubic-bezier(0.455, 0.030, 0.515, 0.955) both',
			},
			keyframes: {
				'flip-vertical-right': {
					'0%': {
						transform: 'rotateY(0)',
					},
					'100%': {
						transform: 'rotateY(180deg)',
					},
				},
			},
		},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['luxury', 'valentine'],
	},
};
export default config;
