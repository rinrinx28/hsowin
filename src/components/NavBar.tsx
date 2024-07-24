import React from 'react';
import Sun from './icons/sun';
import Moon from './icons/moon';
import Link from 'next/link';
import Image from 'next/image';

const NavBar = () => {
	return (
		<div className="w-full flex justify-center items-center">
			<div className="navbar max-w-7xl rounded-md shadow-lg">
				<div className="navbar-start">
					<div className="dropdown">
						<div
							tabIndex={0}
							role="button"
							className="btn btn-ghost lg:hidden">
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
						<ul
							tabIndex={0}
							className="menu menu-sm dropdown-content  rounded-box z-[1] mt-3 w-52 p-2 shadow">
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
					<Link
						href={'/'}
						className="btn btn-ghost text-xl">
						<Image
							alt="hsowin_logo"
							src={'/image/hsowin_logo.gif'}
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
							value="light"
						/>
						<Sun />
						<Moon />
					</label>
					<Link
						href="/login"
						className="btn btn-outline btn-primary">
						Đăng Nhập
					</Link>
					<Link
						href="/resgiter"
						className="btn btn-outline btn-primary hidden lg:inline-flex">
						Đăng Ký
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NavBar;
