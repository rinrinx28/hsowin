import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Providers from '@/lib/redux/Provider';
import { SocketProvider } from '@/lib/socket';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Hsowin VIP',
	description: 'Mini game',
	icons: '/image/icon.png',
	openGraph: {
		type: 'website',
		description:
			'HỆ THỐNG MINI GAME, Kiếm Vàng Ngọc Rồng Giao Dịch Tự Động Uy Tín',
		images: 'https://hsowin.vip/image/icon.png',
		title: 'Hsowin VIP',
		url: 'https://hsowin.vip/',
	},
	keywords: [
		'Trò chơi điện tử ngọc rồng',
		'Mini game kiếm vàng ngọc rồng',
		'Mini game kiếm vàng hồi sinh ngọc rồng',
		'trò chơi điện tử hồi sinh ngọc rồng',
		'Trò chơi cá cược lấy cảm hứng từ hồi sinh ngọc rồng',
		'Hồi sinh ngọc rồng với các tính năng cá cược hấp dẫn',
		'Hồi sinh ngọc rồng koioctieu957',
		'mini game cá cược số 1 hồi sinh ngọc rồng',
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			data-theme="luxury">
			<head>
				<script
					async
					src={`https://www.googletagmanager.com/gtag/js?id=G-HYR5NVVKYJ`}></script>
				<script
					dangerouslySetInnerHTML={{
						__html: `
                window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());

				gtag('config', 'G-HYR5NVVKYJ');
              `,
					}}
				/>
			</head>
			<body className={`${inter.className} transition-wh duration-300 ease`}>
				<Providers>
					<SocketProvider>
						<NavBar />
						{children}
						<Footer />
					</SocketProvider>
				</Providers>
			</body>
		</html>
	);
}
