// src/app/lib/gtag.ts
export const GA_TRACKING_ID = 'G-HYR5NVVKYJ';

// Định nghĩa kiểu cho các đối số của hàm event
interface EventParams {
	action: string;
	category: string;
	label: string;
	value: number;
}

// Hàm để gửi sự kiện trang đã được tải lên Google Analytics
export const pageview = (url: string) => {
	window.gtag('config', GA_TRACKING_ID, {
		page_path: url,
	});
};

// Hàm để gửi sự kiện tùy chỉnh lên Google Analytics
export const event = ({ action, category, label, value }: EventParams) => {
	window.gtag('event', action, {
		event_category: category,
		event_label: label,
		value: value,
	});
};
