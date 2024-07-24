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
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className} p-4`}>
				<NavBar />
				<Container>{children}</Container>
				<Footer />
			</body>
		</html>
	);
}
