// src/app/global.d.ts
export {};

declare global {
	interface Window {
		gtag: (
			type: 'config' | 'event',
			trackingIdOrName: string,
			eventParams?: Record<string, any>,
		) => void;
	}
}
