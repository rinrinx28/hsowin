import React from 'react';
import Sun from './icons/sun';
import Moon from './icons/moon';
import Link from 'next/link';
import Image from 'next/image';
import ImageLoader from '@/lib/ImageLoader';

const NavBar = async () => {
	const logo_hsowin = await ImageLoader('/image/hsowin_logo.gif');
	return (
		<div className="w-full flex justify-center items-center sticky">
			<div className="navbar max-w-7xl rounded-md shadow-lg">
				<div className="navbar-start">
					<div className="lg:hidden">
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
				</div>
				<div className="navbar-center hidden lg:flex">
					<ul className="menu menu-horizontal px-1">
						<li>
							<a>Trang Chủ</a>
						</li>
						<li>
							<a>Mua Vàng</a>
						</li>
						<li>
							<a>Nạp Vàng</a>
						</li>
						<li>
							<a>Rút Vàng</a>
						</li>
					</ul>
				</div>
				<div className="navbar-end gap-4">
					<label className="swap swap-rotate">
						<input
							type="checkbox"
							className="theme-controller"
							value="acid"
						/>
						<Sun />
						<Moon />
					</label>
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
				</div>
			</div>
		</div>
	);
};

export default NavBar;
