import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Container from '@/components/Container';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'HSOWIN CLUB',
	description: 'Mini game',
	icons: 'https://www.hsowin.vip/image/2566.png',
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
