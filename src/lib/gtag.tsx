// src/app/lib/gtag.js
export const GA_TRACKING_ID = 'G-HYR5NVVKYJ';

// Hàm để gửi sự kiện trang đã được tải lên Google Analytics
export const pageview = (url) => {
	window.gtag('config', GA_TRACKING_ID, {
		page_path: url,
	});
};

// Hàm để gửi sự kiện tùy chỉnh lên Google Analytics
export const event = ({ action, category, label, value }) => {
	window.gtag('event', action, {
		event_category: category,
		event_label: label,
		value: value,
	});
};
