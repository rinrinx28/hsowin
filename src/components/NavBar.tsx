'use client';
import React, { use, useEffect, useState } from 'react';
import Sun from './icons/sun';
import Moon from './icons/moon';
import Link from 'next/link';
import Image from 'next/image';
import ImageLoader from '@/lib/ImageLoader';
import { useAppSelector } from '@/lib/redux/hook';
import Gold from './icons/gold';

const NavBar = () => {
	const user = useAppSelector((state) => state.user);
	const logo_hsowin = ImageLoader('/image/hsowin_logo.gif');
	// const [isTheme, setIsTheme] = useState<string | null>(null);

	// useEffect(() => {
	// 	const theme = localStorage.getItem('theme');
	// 	setIsTheme(theme);
	// }, []);

	const changeTheme = (value: boolean) => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('theme', `${value}`);
		}
	};
	return (
		<div className="w-full flex justify-center items-center sticky top-0 z-[1000] backdrop-blur-md">
			<div className="navbar max-w-7xl rounded-md shadow-lg">
				<div className="navbar-start">
					<div className="drawer lg:hidden z-50">
						<input
							id="my-drawer-2"
							type="checkbox"
							className="drawer-toggle"
						/>
						<div className="drawer-content flex flex-col items-center justify-center">
							<label
								htmlFor="my-drawer-2"
								className="drawer-button lg:hidden">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 6h16M4 12h8m-8 6h16"
									/>
								</svg>
							</label>
						</div>
						<div className="drawer-side">
							<label
								htmlFor="my-drawer-2"
								aria-label="close sidebar"
								className="drawer-overlay"></label>
							<ul className="menu menu-vertical bg-base-200 text-base-content min-h-full w-fit p-4">
								{/* Sidebar content here */}
								<li>
									<Link href={'/'}>Trang Chủ</Link>
								</li>
								<li>
									<Link href={'/user?type=NAPBANKING'}>Mua Vàng</Link>
								</li>
								<li>
									<Link href={'/napvang'}>Nạp Vàng</Link>
								</li>
								<li>
									<Link href={'/rutvang'}>Rút Vàng</Link>
								</li>
								<li>
									<hr className="w-full h-1"></hr>
								</li>
								<li>
									<Link href={'/user?type=INFO'}>Thông tin tài khoản</Link>
								</li>
								<li>
									<Link href={'/user?type=NAPBANKING'}>Nạp Bank/Momo</Link>
								</li>
								<li>
									<Link href={'/user?type=RUTBANKING'}>Rút Về Bank/Momo</Link>
								</li>
								<li>
									<Link href={'/user?type=LICHSUCUOC'}>Lịch Sử Cược</Link>
								</li>
								<li>
									<Link href={'/user?type=LICHSUBANK'}>Lịch Sử Bank</Link>
								</li>
							</ul>
						</div>
					</div>
					<Link
						href={'/'}
						className="btn btn-ghost text-xl">
						<Image
							alt="hsowin_logo"
							src={logo_hsowin}
							// className="size-52"
							width={150}
							height={150}
						/>
					</Link>

					<div className="navbar-center hidden lg:flex">
						<ul className="menu menu-horizontal px-1 text-lg">
							<li>
								<Link href={'/'}>Trang Chủ</Link>
							</li>
							<li>
								<Link href={'/user?type=NAPBANKING'}>Mua Vàng</Link>
							</li>
							<li>
								<Link href={'/napvang'}>Nạp Vàng</Link>
							</li>
							<li>
								<Link href={'/rutvang'}>Rút Vàng</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="navbar-end gap-4">
					<label className="swap swap-rotate">
						<input
							type="checkbox"
							className="theme-controller"
							value="emerald"
							// defaultChecked={true}
							// defaultChecked={isTheme === 'true'}
							// onChange={(e) => changeTheme(e.target.checked)}
						/>
						<Sun />
						<Moon />
					</label>
					{!user.isLogin ? (
						<>
							<Link
								href="/login"
								className="btn btn-outline lg:inline-flex hidden">
								Đăng Nhập
							</Link>
							<Link
								href={'/login'}
								className="lg:hidden btn btn-outline">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
									/>
								</svg>
							</Link>
							<Link
								href="/resgiter"
								className="btn btn-outline  hidden lg:inline-flex">
								Đăng Ký
							</Link>
						</>
					) : (
						<>
							<Link
								href={'/user'}
								className="btn btn-outline items-center lg:inline-flex hidden">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 16 16"
									fill="currentColor"
									className="h-4 w-4 opacity-70">
									<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
								</svg>
								{`${user?.username} - ${new Intl.NumberFormat('vi').format(
									user?.gold ?? 0,
								)}`}
								<Gold className="" />
							</Link>
							<Link
								href={'/user'}
								className="btn btn-outline items-center inline-flex lg:hidden">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 16 16"
									fill="currentColor"
									className="h-4 w-4 opacity-70">
									<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
								</svg>
							</Link>

							<button className="btn btn-outline items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									onClick={() => {
										localStorage.removeItem('access_token');
										window.location.reload();
									}}
									className="size-6">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
									/>
								</svg>
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default NavBar;
