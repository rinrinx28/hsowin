const urlConfig = {
	dev: 'http://localhost:3000',
	https: 'https://hsowin.vip',
};

export default function ImageLoader(src: string) {
	return `${urlConfig.dev}/${src}`;
}
