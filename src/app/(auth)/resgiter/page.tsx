'use client';
import apiClient from '@/lib/apiClient';
import ImageLoader from '@/lib/ImageLoader';
import { useAppSelector } from '@/lib/redux/hook';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface InfoResgiter {
	username?: string;
	pwd_h?: string;
	email?: string;
	server?: string;
	name?: string;
}

function Resigter() {
	const logo_hsowin = ImageLoader('image/logo_2.gif');
	const [info, setInfo] = useState<InfoResgiter>({ server: '1' });
	const [msg, setMsg] = useState('');
	const router = useRouter();
	const user = useAppSelector((state) => state.user);
	const handleResgiter = async () => {
		try {
			if (
				!info.username ||
				!info.pwd_h ||
				!info.name ||
				!info.email ||
				!info.server
			) {
				const modal = document.getElementById(
					'lock',
				) as HTMLDialogElement | null;
				if (modal) {
					setMsg('Xin vui lòng điền đầy đủ thông tin ở các ô');
					return modal.showModal();
				}
			}
			const isValid = isValidUsername(info.username ?? '');
			if (!isValid) {
				const modal = document.getElementById(
					'lock',
				) as HTMLDialogElement | null;
				if (modal) {
					setMsg('Xin lỗi, Username không thể dùng các ký hiệu đặc biệt!');
					return modal.showModal();
				}
			}
			const res = await apiClient.post('/auth/resgiter', info);
			if (res.data) {
				router.push('/login');
			}
		} catch (err: any) {
			const modal = document.getElementById('lock') as HTMLDialogElement | null;
			if (modal) {
				let message = err?.response?.data?.message?.split(' ');
				let msg = message.includes('username_1')
					? 'Tên tài khoản đã có người sử dụng'
					: message.includes('name_1')
					? 'Tên hiển thị đã có người sử dụng'
					: err?.response?.data?.message;
				setMsg(msg);
				return modal.showModal();
			}
		}
	};

	useEffect(() => {
		if (user.isLogin) {
			router.push('/user');
		}
	}, [user, router]);
	return (
		<div className="min-h-screen flex justify-center items-center">
			<div className="card bg-base-100 lg:w-1/3 w-full shadow-xl border border-current">
				<figure>
					<Image
						alt="hsowin_logo"
						src={logo_hsowin}
						// className="size-52"
						width={400}
						height={400}
						priority={true}
					/>
				</figure>
				<div className="card-body gap-6">
					<h2 className="card-title justify-center">Đăng Ký Tài Khoản</h2>
					<div className="flex flex-col gap-2 w-full justify-start">
						<label className="input input-bordered flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 16 16"
								fill="currentColor"
								className="h-4 w-4 opacity-70">
								<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
							</svg>
							<input
								type="text"
								className="grow"
								placeholder="Nhập tài khoản"
								onChange={(e) =>
									setInfo((i) => ({ ...i, username: e.target.value }))
								}
							/>
						</label>
						<label className="input input-bordered flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 16 16"
								fill="currentColor"
								className="h-4 w-4 opacity-70">
								<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
							</svg>
							<input
								type="text"
								className="grow"
								placeholder="Tên Hiển Thị"
								onChange={(e) =>
									setInfo((i) => ({ ...i, name: e.target.value }))
								}
							/>
						</label>
						<label className="input input-bordered flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 16 16"
								fill="currentColor"
								className="h-4 w-4 opacity-70">
								<path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
								<path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
							</svg>
							<input
								type="text"
								className="grow"
								placeholder="Email"
								onChange={(e) =>
									setInfo((i) => ({ ...i, email: e.target.value }))
								}
							/>
						</label>
						<label className="input input-bordered flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 16 16"
								fill="currentColor"
								className="h-4 w-4 opacity-70">
								<path
									fillRule="evenodd"
									d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
									clipRule="evenodd"
								/>
							</svg>
							<input
								type="password"
								className="grow"
								placeholder="Nhập mật khẩu"
								onChange={(e) =>
									setInfo((i) => ({ ...i, pwd_h: e.target.value }))
								}
							/>
						</label>
						<label className="label w-full justify-center">
							<select
								defaultValue={'3'}
								className="select select-bordered w-full max-w-md select-md"
								onChange={(e) =>
									setInfo((i) => ({ ...i, server: e.target.value }))
								}>
								<option value="1">Server 1</option>
								<option value={'2'}>Server 2</option>
								<option
									selected
									value={'3'}>
									Server 3
								</option>
							</select>
						</label>
					</div>
					<div className="card-actions justify-around">
						<button
							className="btn"
							onClick={handleResgiter}>
							Đăng Ký Ngay
						</button>
						<Link
							href={'/login'}
							className="btn">
							Đăng Nhập
						</Link>
					</div>
				</div>
			</div>
			<dialog
				id="lock"
				className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Thông Báo Người Chơi</h3>
					<p className="py-4">{msg}</p>
					<div className="modal-action">
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button className="btn">Đóng</button>
						</form>
					</div>
				</div>
			</dialog>
		</div>
	);
}

export default Resigter;

function isValidUsername(username: string): boolean {
	// Chỉ cho phép các ký tự a-z, A-Z, 0-9 và _
	const validUsernameRegex = /^[a-zA-Z0-9_]+$/;
	return validUsernameRegex.test(username);
}
