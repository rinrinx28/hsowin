import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Container from '@/components/Container';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Hsowin VIP',
	description: 'Mini game',
	icons: 'https://www.hsowin.vip/image/icon.png',
	openGraph: {
		type: 'website',
		description:
			'HỆ THỐNG MINI GAME, Kiếm Vàng Ngọc Rồng Giao Dịch Tự Động Uy Tín',
		images: 'https://www.hsowin.vip/image/icon.png',
		title: 'Hsowin VIP',
		url: 'https://www.hsowin.vip/',
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
		<html lang="en">
			<body className={`${inter.className} pt-4`}>
				<NavBar />
				<Container>{children}</Container>
				<Footer />
			</body>
		</html>
	);
}
