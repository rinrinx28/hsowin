'use client';
import apiClient from '@/lib/apiClient';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { updateUser } from '@/lib/redux/features/auth/user';
import Gold from '@/components/icons/gold';
import { useSocket } from '@/lib/socket';

interface InfoNapVang {
	server?: string;
	type: string;
	amount?: any;
	playerName?: string;
	uid?: string;
}

export default function PageNapVang() {
	const socket = useSocket();
	const user = useAppSelector((state) => state.user);
	const [info, setInfo] = useState<InfoNapVang>({
		type: '0',
	});
	const [bot, setBot] = useState([]);
	const [session, setSession] = useState<any[]>([]);
	const eventConfig = useAppSelector((state) => state.eventConfig);
	const [config, setConfig] = useState({ min: 0 });
	const [msg, setMsg] = useState('');
	const router = useRouter();

	const handleNapVang = async () => {
		try {
			console.log(info);
			if (!user?.isLogin) {
				const modal = document.getElementById(
					'noti',
				) as HTMLDialogElement | null;
				if (modal) {
					setMsg('Bạn chưa đăng nhập!');
					return modal.showModal();
				}
			}
			if (
				!info.server ||
				!info.type ||
				!info.amount ||
				!info.playerName ||
				!info.uid
			) {
				const modal = document.getElementById(
					'lock',
				) as HTMLDialogElement | null;
				if (modal) {
					setMsg('Xin vui lòng điền đầy đủ thông tin ở các ô');
					return modal.showModal();
				}
			}
			const res = await apiClient.post('/session/create', info, {
				headers: {
					Authorization: 'Bearer ' + user?.token,
				},
			});

			setSession((e) =>
				[...e, res?.data].sort(
					(a: any, b: any) =>
						moment(b.createdAt).unix() - moment(a.createdAt).unix(),
				),
			);
			const modal = document.getElementById('lock') as HTMLDialogElement | null;
			if (modal) {
				setMsg('Đã tạo đơn nạp thành công!');
				return modal.showModal();
			}
		} catch (err: any) {
			const modal = document.getElementById('lock') as HTMLDialogElement | null;
			if (modal) {
				setMsg(err?.response?.data?.message);
				return modal.showModal();
			}
		}
	};

	const handleCancelNap = async (sessionId: any, uid: any) => {
		try {
			const res = await apiClient.post(
				'/session/cancel',
				{
					sessionId,
					uid,
				},
				{
					headers: {
						Authorization: 'Bearer ' + user?.token,
					},
				},
			);
			setSession((e: any) => [
				...e?.filter((i: any) => i?._id !== sessionId),
				res.data,
			]);
			const modal = document.getElementById('lock') as HTMLDialogElement | null;
			if (modal) {
				setMsg('Đã hủy đơn nạp thành công!');
				return modal.showModal();
			}
		} catch (err: any) {
			const modal = document.getElementById('lock') as HTMLDialogElement | null;
			if (modal) {
				setMsg(err?.response?.data?.message);
				return modal.showModal();
			}
		}
	};

	useEffect(() => {
		const getBotLog = async () => {
			const res = await apiClient.get('/bot/all', {
				headers: {
					Authorization: 'Bearer ' + user?.token,
				},
			});
			const data = res.data;
			setBot(data);
		};
		const getSessionLog = async () => {
			const res = await apiClient.get('/session/all', {
				headers: {
					Authorization: 'Bearer ' + user?.token,
				},
			});
			const data = res.data;
			setSession(
				data.sort(
					(a: any, b: any) =>
						moment(b.createdAt).unix() - moment(a.createdAt).unix(),
				),
			);
		};

		if (user?.isLogin && localStorage.getItem('access_token')) {
			setInfo((e) => ({ ...e, uid: user?._id, server: user?.server }));
			getBotLog();
			getSessionLog();
			const modal = document.getElementById('noti') as HTMLDialogElement | null;
			if (modal) {
				return modal.close();
			}
		} else {
			const modal = document.getElementById('noti') as HTMLDialogElement | null;
			if (modal) {
				setMsg('Bạn chưa đăng nhập, xin vui lòng đăng nhập!');
				return modal.showModal();
			}
		}
	}, [user, router]);

	useEffect(() => {
		socket.on('session-res', (data) => {
			console.log(data);
		});

		return () => {
			socket.off('session-res');
		};
	}, [user, socket]);

	useEffect(() => {
		if (eventConfig) {
			const min_deposit_gold = eventConfig.find(
				(e) => e.name === 'e-min-deposit-gold',
			);
			setConfig((e) => ({
				...e,
				min: min_deposit_gold?.value ?? 0,
			}));
		}
	}, [eventConfig]);

	return (
		<div>
			<div className="min-h-screen flex flex-col justify-center items-center p-2">
				<div className="max-w-7xl w-full flex flex-col gap-2">
					<h1 className="uppercase text-3xl pb-2 border-b-2 border-current">
						NẠP VÀNG
					</h1>
					<div className="flex flex-col gap-2 bg-base-300 p-4">
						<p>Hệ thống nạp vàng tự động</p>
						<p>Bước 1: Đặt đơn nạp vàng trên website</p>
						<p>Bước 2: Vào đúng địa điểm gặp nhân vật nhận hàng để giao dịch</p>
						<p>
							Sau khi giao dịch thành công bạn sẽ được cộng vàng trên website
							sau 3 giây
						</p>
						<p>- Tỷ lệ nạp 100%, nạp 100 thỏi vàng được 100 thỏi vàng</p>
						<p>
							Hệ thống tự động hủy đơn sau 10 phút nếu chưa giao dịch thành công
						</p>
					</div>
					<div className="flex lg:flex-row flex-col gap-5 justify-between">
						<div className="flex flex-col w-full gap-2 border border-current p-8 rounded-lg">
							<h2 className="text-center border-b border-current pb-2 flex flex-row gap-2 justify-center items-center">
								Số dư: {new Intl.NumberFormat('vi').format(user?.gold ?? 0)}{' '}
								<span>
									<Gold className="" />
								</span>
							</h2>
							<div className="max-w-xl">
								<label className="label w-full text-nowrap gap-2">
									<p>Máy Chủ:</p>
									<input
										type="text"
										placeholder="Type here"
										className="input input-bordered w-full max-w-md"
										disabled
										value={`Server ${user?.server}`}
									/>
								</label>
								<label className="label w-full text-nowrap gap-2">
									<p>Hình thức:</p>
									<input
										type="text"
										placeholder="Type here"
										className="input input-bordered w-full max-w-md"
										disabled
										value={'Thỏi Vàng'}
									/>
								</label>
								<label className="label w-full text-nowrap gap-2">
									<p>Nhân vật:</p>
									<input
										type="text"
										placeholder="Nhập tên nhân vật"
										className="input input-bordered w-full max-w-md"
										onChange={(e) =>
											setInfo((i) => ({ ...i, playerName: e.target.value }))
										}
									/>
								</label>
								<label className="label w-full text-nowrap gap-2">
									<p>Số thỏi vàng cần nạp:</p>
									<input
										type="text"
										className="input input-bordered w-full max-w-md"
										onChange={(e) =>
											setInfo((i) => ({ ...i, amount: e.target.value }))
										}
									/>
								</label>
								<p>Bạn cần phải nạp tối thiểu {config.min} thỏi vàng!</p>
							</div>
							<button
								className="btn"
								onClick={handleNapVang}>
								Nạp Ngay
							</button>
						</div>
						<div className="flex flex-col gap-2 border border-current p-8 rounded-lg lg:max-w-2xl w-full">
							<h2 className="text-center border-b border-current pb-2">
								Vị trí nhân vật nhận vàng
							</h2>
							<div className="overflow-auto border border-current max-h-[600px]">
								<table className="table table-lg table-pin-rows table-pin-cols">
									{/* head */}
									<thead className="text-sm  text-center">
										<tr>
											<th>Nhân Vật</th>
											<th>Địa Điểm</th>
											<th>Khu Vực</th>
											<th>Số Thỏi Vàng</th>
										</tr>
									</thead>
									<tbody className="text-sm text-center text-nowrap">
										{/* row 1 */}
										{bot
											?.filter((b: any) => b?.server === user?.server)
											.map((userBet: any) => {
												const { _id, name, gold, map, zone } = userBet;
												return (
													<tr
														className="hover"
														key={_id}>
														<td>{name}</td>
														<td>{map}</td>
														<td>{zone}</td>
														<td>
															{new Intl.NumberFormat('vi').format(Number(gold))}
														</td>
													</tr>
												);
											})}
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div>
						<div className="flex flex-col gap-2 border border-current p-8 rounded-lg w-full">
							<h2 className="text-center border-b border-current pb-2">
								LỊCH SỬ GIAO DỊCH
							</h2>
							<div className="overflow-auto border border-current max-h-[600px]">
								<table className="table table-lg table-pin-rows table-pin-cols">
									{/* head */}
									<thead className="text-sm  text-center">
										<tr>
											<th>Server</th>
											<th>Nhân vật</th>
											<th>Số vàng</th>
											<th>Đã Nhận</th>
											<th>Tình trạng</th>
											<th>Thời gian</th>
											<th>Điều khiển</th>
										</tr>
									</thead>
									<tbody className="text-sm text-center text-nowrap">
										{/* row 1 */}
										{session
											?.filter(
												(b: any) =>
													b?.server === user?.server &&
													b?.type === '0' &&
													b?.uid === user?._id,
											)
											.map((userBet: any) => {
												const {
													_id,
													server,
													playerName,
													amount,
													status,
													createdAt,
													type,
													uid,
													recive,
												} = userBet;
												return (
													<tr
														className="hover"
														key={_id}>
														<td>{server}</td>
														<td>{playerName}</td>
														<td>
															{new Intl.NumberFormat('vi').format(
																Number(amount),
															)}
														</td>
														<td>
															{new Intl.NumberFormat('vi').format(
																Number(recive ?? 0),
															)}
														</td>
														<td>
															{status === '0'
																? 'Chờ Thanh Toán'
																: status === '2'
																? 'Thành Công'
																: 'Đã Hủy'}
														</td>
														<td>
															{moment(createdAt).format('DD/MM/YYYY HH:mm:ss')}
														</td>
														<td>
															{status === '0' && (
																<button
																	onClick={() => handleCancelNap(_id, uid)}
																	className="btn btn-error btn-sm">
																	Hủy
																</button>
															)}
														</td>
													</tr>
												);
											})}
									</tbody>
								</table>
							</div>
						</div>
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
			<dialog
				id="noti"
				className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Thông Báo Người Chơi</h3>
					<p className="py-4">
						Xin lỗi, bạn chưa đăng nhập, xin vui đăng nhập để tiếp tục sử dụng
						dịch vụ!
					</p>
					<div className="modal-action">
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button
								className="btn"
								onClick={() => router.push('/login')}>
								Đăng Nhập
							</button>
						</form>
					</div>
				</div>
			</dialog>
		</div>
	);
}
