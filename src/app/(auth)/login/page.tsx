'use client';
import apiClient from '@/lib/apiClient';
import ImageLoader from '@/lib/ImageLoader';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { login, userState } from '@/lib/redux/features/auth/user';
import { useRouter } from 'next/navigation';
import { updateUserVip } from '@/lib/redux/features/auth/userVip';

interface Info {
	username: string;
	password: string;
}

function LoginPage() {
	const [loginInfo, setLogin] = useState<Info>({ username: '', password: '' });
	const [isStay, setStay] = useState(true);
	const [msg, setMsg] = useState('');
	const logo_hsowin = ImageLoader('image/logo_2.gif');
	const user = useAppSelector((state) => state.user);
	const router = useRouter();
	const dispatch = useAppDispatch();

	const handlerLogin = async (e: any) => {
		e.preventDefault();
		if (loginInfo.username.length < 1 || loginInfo.password.length < 1) return;
		try {
			const res = await apiClient.post('/auth/login', loginInfo);
			const data = res.data;
			const { clan, ...new_data } = data.user;
			const new_clan = JSON.parse(clan);
			dispatch(
				login({
					...new_data,
					clan: new_clan,
					token: data?.access_token,
					isLogin: true,
				}),
			);
			if (isStay) {
				localStorage.setItem('access_token', data?.access_token);
			}
			const res_info = await apiClient.get('/user/vip/info', {
				headers: {
					Authorization: 'Bearer ' + data?.access_token,
				},
			});
			dispatch(
				updateUserVip({
					...res_info.data,
					data: JSON.parse(res_info.data.data),
				}),
			);
			router.push('/');
		} catch (err: any) {
			const modal = document.getElementById(
				'error',
			) as HTMLDialogElement | null;
			if (modal) {
				setMsg(err?.response?.data?.message);
				modal.showModal();
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
						width={400}
						height={400}
						priority={true}
					/>
				</figure>
				<div className="card-body gap-6">
					<h2 className="card-title justify-center">Đăng Nhập</h2>
					<form
						className="flex flex-col gap-2 w-full justify-start"
						onSubmit={handlerLogin}>
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
								placeholder="Username"
								onChange={(e) =>
									setLogin((l) => ({ ...l, username: e.target.value }))
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
								placeholder="Nhập password"
								className="grow"
								onChange={(e) =>
									setLogin((l) => ({ ...l, password: e.target.value }))
								}
							/>
						</label>
						<div className="flex flex-row justify-start items-center ">
							<label className="label cursor-pointer gap-4">
								<input
									type="checkbox"
									defaultChecked
									className="checkbox"
									onChange={(e) => setStay(e.target.checked)}
								/>
								<span className="label-text">
									Lưu thông tin để tiện lợi hơn cho lần sau (Chỉ sử dụng trên
									thiết bị cá nhân)
								</span>
							</label>
						</div>
						<div className="card-actions justify-around">
							<button
								className="btn"
								type="submit">
								Đăng Nhập
							</button>
							<Link
								href={'/resgiter'}
								className="btn">
								Đăng Ký
							</Link>
						</div>
					</form>
				</div>
				<dialog
					id="error"
					className="modal">
					<div className="modal-box">
						<h3 className="font-bold text-lg flex flex-row gap-2 items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 shrink-0 stroke-current"
								fill="none"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>{' '}
							Thông Báo Người Chơi
						</h3>
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
		</div>
	);
}

export default LoginPage;
