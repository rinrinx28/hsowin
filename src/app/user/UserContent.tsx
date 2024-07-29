'use client';
import apiClient from '@/lib/apiClient';
import { useAppSelector } from '@/lib/redux/hook';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { TranslateKey } from '@/lib/unit/translateKey';
import moment from 'moment';

const UserContent = () => {
	const user = useAppSelector((state) => state.user);
	const [menu, setMenu] = useState('INFO');
	const searchParams = useSearchParams();
	const [msg, setMsg] = useState('');
	const router = useRouter();

	useEffect(() => {
		const id = searchParams.get('id');
		const status = searchParams.get('status');
		const type = searchParams.get('type');
		if (status === 'CANCELLED') {
			try {
				apiClient.post(
					`/session/banking/update?orderId=${id}`,
					{},
					{
						headers: {
							Authorization: 'Bearer ' + localStorage.getItem('access_token'),
						},
					},
				);
			} catch (err) {}
		}
		if (type === 'NAPBANKING') {
			setMenu('NAPBANKING');
		}
	}, [searchParams]);

	useEffect(() => {
		let timeOutRedic = setTimeout(() => {
			if (!user.isLogin) {
				router.push('/');
			}
		}, 1e3 * 5);
		return () => {
			clearTimeout(timeOutRedic);
		};
	}, [user, router]);

	return (
		<div className="min-h-screen flex justify-center mt-10 p-8">
			<div className="max-w-7xl w-full flex justify-between gap-10">
				<div className="flex flex-col gap-5 items-start flex-nowrap text-nowrap p-4 border-r border-current">
					<h1 className="uppercase text-3xl pb-2 border-b-2 border-current">
						MENU TÀI KHOẢN
					</h1>
					<ul className="flex flex-col gap-4 items-start justify-start">
						<li
							className="text-xl btn btn-ghost"
							onClick={() => setMenu('INFO')}>
							Thông tin tài khoản
						</li>
						<li
							className="text-xl btn btn-ghost"
							onClick={() => setMenu('NAPTHE')}>
							Nạp Thẻ Cào
						</li>
						<li
							className="text-xl btn btn-ghost"
							onClick={() => setMenu('NAPBANKING')}>
							Nạp Banking
						</li>
						<li
							className="text-xl btn btn-ghost"
							onClick={() => setMenu('RUTBANKING')}>
							Rút Về Banking
						</li>
						<li
							className="text-xl btn btn-ghost"
							onClick={() => setMenu('LICHSUCUOC')}>
							Lịch Sử Cược
						</li>
						<li
							className="text-xl btn btn-ghost"
							onClick={() => setMenu('CHUYENVANG')}>
							Chuyển Vàng Cho Người Chơi
						</li>
						<li
							className="text-xl btn btn-ghost"
							onClick={() => {
								const modal = document.getElementById(
									'lock',
								) as HTMLDialogElement | null;
								if (modal) {
									setMsg(
										'Xin lỗi tính năng tạm đang được phát triển, vui lòng thử lại sau!',
									);
									return modal.showModal();
								}
							}}>
							Nhiệm Vụ Hàng Ngày
						</li>
					</ul>
				</div>
				{menu === 'INFO' && <ProfileUser />}
				{menu === 'NAPTHE' && <NapThe />}
				{menu === 'NAPBANKING' && <NapBanking />}
				{menu === 'RUTBANKING' && <RutBanking />}
				{menu === 'LICHSUCUOC' && <HistoryUserBet />}
				{menu === 'CHUYENVANG' && <TradeOtherUser />}
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
};

export default UserContent;

//TODO ———————————————[Sub Page]———————————————

function ProfileUser() {
	const user = useAppSelector((state) => state.user);
	return (
		<div className="flex flex-col gap-5 items-center w-1/2 p-4">
			<h1 className="uppercase text-3xl pb-2 border-b-2 border-current">
				Thông tin tài khoản
			</h1>
			<ul className="flex flex-col gap-4 items-start justify-start w-full">
				<li className="w-full h-10 gap-5 rounded-md bg-base-300 flex flex-row justify-start p-4 items-center">
					<p>ID Tài Khoản:</p>
					<p className="font-semibold">{user._id}</p>
				</li>
				<li className="w-full h-10 gap-5 rounded-md bg-base-300 flex flex-row justify-start p-4 items-center">
					<p>Tên Tài Khoản:</p>
					<p className="font-semibold">{user.username}</p>
				</li>
				<li className="w-full h-10 gap-5 rounded-md bg-base-300 flex flex-row justify-start p-4 items-center">
					<p>Email Tài Khoản:</p>
					<p className="font-semibold">{user.email}</p>
				</li>
				<li className="w-full h-10 gap-5 rounded-md bg-base-300 flex flex-row justify-start p-4 items-center">
					<p>Tên hiển thị:</p>
					<p className="font-semibold">{user?.name}</p>
				</li>
				<li className="w-full gap-2 rounded-md bg-base-300 flex flex-col justify-start p-4 items-start">
					<p className="text-primary">Thông Tin VIP:</p>
					<p className="text-error font-semibold">
						30 ngày qua đã nạp: <span className="text-secondary">0</span> (Chưa
						có vip vui lòng nạp đủ 100k)
					</p>
				</li>
				<li className="w-full h-10 gap-5 rounded-md bg-base-300 flex flex-row justify-start p-4 items-center">
					<p>Số Thỏi Vàng:</p>
					<p className="text-green-500">
						{new Intl.NumberFormat('vi').format(user.gold ?? 0)}
					</p>
				</li>
				<li className="w-full h-10 gap-5 rounded-md bg-base-300 flex flex-row justify-start p-4 items-center">
					<p>Kim Cương hiện có:</p>
					<p className="text-green-500">
						{new Intl.NumberFormat('vi').format(user.diamon ?? 0)}
					</p>
				</li>
				<li className="w-full h-10 gap-5 rounded-md bg-base-300 flex flex-row justify-start p-4 items-center">
					<p>Tháng này đã hiến:</p>
					<p className="text-green-500">
						{new Intl.NumberFormat('vi', {
							currency: 'VND',
							style: 'currency',
						}).format(user.totalBet ?? 0)}
					</p>
				</li>
				<li className="w-full h-10 gap-5 rounded-md bg-base-300 flex flex-row justify-start p-4 items-center">
					Đổi Mật Khẩu
				</li>
			</ul>
		</div>
	);
}

function NapThe() {
	const user = useAppSelector((state) => state.user);
	const handleNapThe = () => {
		const modal = document.getElementById('lock') as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
	};
	return (
		<div className="flex flex-col gap-5 items-start p-4 w-full">
			<h1 className="uppercase text-3xl pb-2 border-b-2 border-current">
				NẠP TỪ THẺ CÀO
			</h1>
			<div className="flex flex-col gap-2 w-full p-4 rounded-md bg-base-300">
				<p className="text-error">Tỉ lệ nạp thẻ cào 16000%</p>
				<p className="text-error">Nạp 100k nhận 1600tr vàng</p>
				<p>
					<span className="text-success">Tặng ngẫu nhiên</span> từ{' '}
					<span className="text-success">2tr tới 250tr</span> cho mỗi lượt nạp
					thẻ cào
				</p>
				<p>
					Mỗi <span className="font-semibold">lượt nạp</span> được{' '}
					<span className="text-error">tặng kim cương</span>
				</p>
				<p>
					Kim cương <span className="text-error">đổi</span> vàng{' '}
					<span className="link link-warning link-hover">tại đây</span>
				</p>
				<p>
					Sai serial hoặc mệnh giá sẽ không được hỗ trợ giải quyết khiếu nại!
				</p>
			</div>
			<div className="flex flex-col gap-4 items-center justify-center w-full">
				<label className="label w-2/3">
					<p>ID Tài Khoản:</p>
					<input
						type="text"
						placeholder="Type here"
						className="input input-bordered w-full max-w-md"
						disabled
						value={user._id}
					/>
				</label>

				<label className="label w-2/3">
					<p>Tên Tài Khoản:</p>
					<input
						type="text"
						placeholder="Type here"
						className="input input-bordered w-full max-w-md"
						disabled
						value={user.username}
					/>
				</label>

				<label className="label w-2/3">
					<p>Loại thẻ::</p>
					<select className="select select-bordered w-full max-w-md select-md">
						<option
							disabled
							selected>
							VIETEL
						</option>
						{['VINAPHONE', 'MOBIFONE'].map((value) => (
							<option
								key={value}
								value={value}>
								{value}
							</option>
						))}
					</select>
				</label>

				<label className="label w-2/3">
					<p>Mệnh giá:</p>
					<select className="select select-bordered w-full max-w-md select-md">
						<option
							disabled
							selected>
							CHỌN ĐÚNG MỆNH GIÁ, NẾU SAI SẼ MẤT THẺ
						</option>
						{[
							1e3 * 10,
							1e3 * 20,
							1e3 * 30,
							1e3 * 50,
							1e3 * 100,
							1e3 * 200,
							1e3 * 300,
							1e3 * 500,
							1e3 * 1000,
						].map((value) => (
							<option
								key={value}
								value={value}>
								{new Intl.NumberFormat('vi', {
									currency: 'VND',
									style: 'currency',
								}).format(value)}
							</option>
						))}
					</select>
				</label>

				<label className="label w-2/3">
					<p>Mã thẻ:</p>
					<input
						type="text"
						className="input input-bordered w-full max-w-md"
					/>
				</label>

				<label className="label w-2/3">
					<p>Số Serial:</p>
					<input
						type="text"
						className="input input-bordered w-full max-w-md"
					/>
				</label>

				<div className="flex flex-col gap-2">
					<p className="text-xs">
						Sai serial hoặc mệnh giá sẽ không được hỗ trợ giải quyết khiếu nại!
					</p>
					<button
						className="btn btn-lg"
						onClick={handleNapThe}>
						NẠP NGAY
					</button>
				</div>
			</div>
			<dialog
				id="lock"
				className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Thông Báo Người Chơi</h3>
					<p className="py-4">
						Chức Năng Nạp Thẻ Hiện Đóng, xin vui lòng thử lại sau!
					</p>
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

function NapBanking() {
	const user = useAppSelector((state) => state.user);
	const [msg, setMsg] = useState('');
	const [amount, setAmount] = useState('0');
	const router = useRouter();

	const handleNapBank = async () => {
		try {
			if (!containsLettersAndSpecialChars(amount)) {
				const modal = document.getElementById(
					'err-bank',
				) as HTMLDialogElement | null;
				if (modal) {
					setMsg('Xin vui lòng chỉ nhập chữ số ở trường Nhập Số Tiền');
					return modal.showModal();
				}
			}
			const res = await apiClient.post(
				'/session/banking/create',
				{
					uid: user._id,
					amount: Number(amount),
				},
				{
					headers: {
						Authorization: 'Bearer ' + user?.token,
					},
				},
			);
			const data = res.data;
			if (data.code === '00') {
				const url = data?.data.checkoutUrl;
				router.push(url);
				return;
			}
		} catch (err) {
			const modal = document.getElementById(
				'err-bank',
			) as HTMLDialogElement | null;
			if (modal) {
				setMsg('Đã xảy ra lỗi, xin vui lòng thử lại sau chút lát!');
				return modal.showModal();
			}
		}
	};

	useEffect(() => {
		const modal = document.getElementById(
			'noti-vip',
		) as HTMLDialogElement | null;
		if (modal) {
			return modal.showModal();
		}
	}, []);
	return (
		<div className="flex flex-col gap-5 items-start p-4 w-full">
			<h1 className="uppercase text-3xl pb-2 border-b-2 border-current">
				NẠP TỪ BANKING
			</h1>
			<div className="flex flex-col gap-2 w-full p-4 rounded-md bg-base-300">
				<p className="text-error">Tỉ lệ 0.48%</p>
				<p className="text-error">Nạp 100k nhận 480 thỏi vàng</p>
				<p>
					<span className="text-success">Tặng ngẫu nhiên</span> từ{' '}
					<span className="text-success">2 thỏi vàng tới 25 thỏi vàng</span> cho
					mỗi lượt nạp từ <span className="text-success">BANKING</span>
				</p>
				<p>
					Mỗi <span className="font-semibold">lượt nạp</span> được{' '}
					<span className="text-error">tặng kim cương</span>
				</p>
				<p>
					Kim cương <span className="text-error">đổi</span> thỏi vàng{' '}
					<span className="link link-warning link-hover">tại đây</span>
				</p>
				<p>
					Mỗi lần nạp khách hàng vui lòng tạo đơn nạp mới và thực hiện chuyển
					khoản đúng theo yêu cầu
				</p>
				<p>
					Lưu ý: <span className="text-error"> KHÔNG</span> chuyển lại đơn cũ sẽ
					mất tiền.
				</p>
				<p>Mã nạp sắp hết hạn vui lòng hủy rồi tạo mã mới để tránh lỗi!</p>
				<p>Nạp tối thiểu 10K và đúng nội dung để được xử lý tự động!</p>
			</div>
			<div className="flex flex-col gap-4 items-center justify-center w-full">
				<label className="label w-3/4">
					<p>ID Tài Khoản:</p>
					<input
						type="text"
						placeholder="Type here"
						className="input input-bordered w-full max-w-md"
						disabled
						value={user._id}
					/>
				</label>

				<label className="label w-3/4">
					<p>Tên Tài Khoản:</p>
					<input
						type="text"
						placeholder="Type here"
						className="input input-bordered w-full max-w-md"
						disabled
						value={user.username}
					/>
				</label>

				<label className="label w-3/4">
					<p>Nhập Số Tiền:</p>
					<input
						type="text"
						className="input input-bordered w-full max-w-md"
						onChange={(e) => setAmount(e.target.value)}
					/>
				</label>

				<div className="flex flex-col gap-2 w-3/4">
					<button
						className="btn btn-lg"
						onClick={handleNapBank}>
						NẠP NGAY
					</button>
				</div>
			</div>
			<dialog
				id="lock"
				className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Thông Báo Người Chơi</h3>
					<p className="py-4">
						Chức Năng Nạp Thẻ Hiện Đóng, xin vui lòng thử lại sau!
					</p>
					<div className="modal-action">
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button className="btn">Đóng</button>
						</form>
					</div>
				</div>
			</dialog>
			<dialog
				id="noti-vip"
				className="modal">
				<div className="modal-box max-w-xl w-full">
					<h3 className="font-bold text-lg">Thông Báo Người Chơi</h3>
					<div className="py-4 flex flex-col gap-2">
						<p>
							Mua vàng tích tiền lên{' '}
							<span className="text-error">thành viên VIP</span>
						</p>
						<div className="overflow-x-auto">
							<table className="table">
								{/* head */}
								<thead className="bg-error text-white">
									<tr className="text-center">
										<th>VIP</th>
										<th>Số Tiền</th>
										<th>Số Thỏi Vàng Nhận</th>
									</tr>
								</thead>
								<tbody className="text-center">
									{[
										{ price: 1e3 * 50, prize: 10 },
										{ price: 1e3 * 400, prize: 20 },
										{ price: 1e3 * 1000, prize: 40 },
										{ price: 1e3 * 3000, prize: 100 },
										{ price: 1e3 * 5000, prize: 300 },
										{ price: 1e3 * 15000, prize: 500 },
										{ price: 1e3 * 50000, prize: 1000 },
									].map((vip, i) => {
										const { price, prize } = vip;
										return (
											<tr key={`${i}-vip`}>
												<td>VIP {i + 1}</td>
												<td>
													{new Intl.NumberFormat('vi', {
														currency: 'VND',
														style: 'currency',
													}).format(price)}
												</td>
												<td>{prize} Thỏi/ngày</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
						<p className="text-error">Lưu ý:</p>
						<p>
							- VIP tương ứng với tổng số tiền bạn nạp trong 30 ngày gần nhất!
						</p>
						<p>- Áp dụng cho nạp thẻ cào và ví</p>
						<p>
							- Khi lên VIP bạn sẽ trông ngầu hơn khi chém gió và đặc biệt rất
							dễ tán gái nhé
						</p>
					</div>
					<div className="modal-action">
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button className="btn">Đóng</button>
						</form>
					</div>
				</div>
			</dialog>
			<dialog
				id="err-bank"
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

interface TypeRutBank {
	type?: string;
	bankName?: string;
	amount?: any;
	accountNumber?: any;
	accountName?: any;
}

function RutBanking() {
	const user = useAppSelector((state) => state.user);
	const [msg, setMsg] = useState('');
	const [info, setInfo] = useState<TypeRutBank>({});

	const handleRutBank = async () => {
		try {
			if (!containsLettersAndSpecialChars(info?.amount)) {
				const modal = document.getElementById(
					'err-bank',
				) as HTMLDialogElement | null;
				if (modal) {
					setMsg('Xin vui lòng chỉ nhập chữ số ở trường Nhập Số Tiền');
					return modal.showModal();
				}
			}

			const res = await apiClient.post(
				'/user/bank/withdraw',
				{
					uid: user._id,
					...info,
				},
				{
					headers: {
						Authorization: 'Bearer ' + user.token,
					},
				},
			);

			if (res.data) {
				const modal = document.getElementById(
					'success-bank',
				) as HTMLDialogElement | null;
				if (modal) {
					setMsg('Đã rút thành công, xin vui lòng đợi trong ít phút!');
					return modal.showModal();
				}
			}
		} catch (err) {
			const modal = document.getElementById(
				'err-bank',
			) as HTMLDialogElement | null;
			if (modal) {
				setMsg('Đã xảy ra lỗi, xin vui lòng thử lại sau chút lát!');
				return modal.showModal();
			}
		}
	};

	useEffect(() => {
		const modal = document.getElementById(
			'noti-vip',
		) as HTMLDialogElement | null;
		if (modal) {
			return modal.showModal();
		}
	}, []);
	return (
		<div className="flex flex-col gap-5 items-start p-4 w-full">
			<h1 className="uppercase text-3xl pb-2 border-b-2 border-current">
				Rút Tiền Về Ví
			</h1>
			<div className="flex flex-col gap-2 w-full p-4 rounded-md bg-base-300">
				<p>
					Thông Báo: Cập nhật hệ thống rút tiền tự động về Ngân hàng và Momo,
					rút tối thiểu 50k, max 1tr/lần, 3tr/ngày
				</p>
				<p>Bước 1: Đặt đơn rút tiền trên website</p>
				<p>Bước 2: Admin sẽ duyệt và tiền sẽ về túi của bạn nhanh chóng.</p>
			</div>
			<div className="flex flex-col gap-2 w-full p-4 rounded-md bg-base-300">
				<p>Số dư: {new Intl.NumberFormat('vi').format(user?.gold ?? 0)}</p>
				<p>
					Hệ Số: x 0.62% ={' '}
					{new Intl.NumberFormat('vi', {
						currency: 'VND',
						style: 'currency',
					}).format(Math.floor((user?.gold ?? 0) / 0.0062))}
				</p>
			</div>
			<div className="flex flex-col gap-4 items-center justify-center w-full">
				<label className="label w-3/4">
					<p>ID Tài Khoản:</p>
					<input
						type="text"
						placeholder="Type here"
						className="input input-bordered w-full max-w-md"
						disabled
						value={user._id}
					/>
				</label>

				<label className="label w-3/4">
					<p>Hình Thức:</p>
					<select
						defaultValue={'OTHER'}
						className="select select-bordered w-full max-w-md select-md"
						onChange={(e) => setInfo((i) => ({ ...i, type: e.target.value }))}>
						<option
							selected
							value="OTHER">
							Chọn Hình Thức
						</option>
						<option value={'BANK'}>Ngân Hàng</option>
						<option value={'MOMO'}>Ví Điện Tử</option>
					</select>
				</label>

				{info?.type === 'BANK' && (
					<label className="label w-3/4">
						<p>Ngân hàng:</p>
						<select
							defaultValue={'OTHER'}
							className="select select-bordered w-full max-w-md select-md"
							onChange={(e) =>
								setInfo((i) => ({ ...i, bankName: e.target.value }))
							}>
							<option
								selected
								value="OTHER">
								Chọn Ngân Hàng
							</option>
							{ListBank.map((bank) => {
								const { name, code } = bank;
								return (
									<option
										key={bank.id}
										value={`${bank.name}-${code}`}>
										{code} - {name}
									</option>
								);
							})}
						</select>
					</label>
				)}

				{info?.type === 'MOMO' && (
					<label className="label w-3/4">
						<p>Loại Ví:</p>
						<select
							defaultValue={'OTHER'}
							className="select select-bordered w-full max-w-md select-md">
							<option
								selected
								value="OTHER">
								MOMO
							</option>
						</select>
					</label>
				)}

				<label className="label w-3/4">
					<p>Tên Tài Khoản:</p>
					<input
						type="text"
						placeholder="Nhập tên tài khoản của bạn"
						className="input input-bordered w-full max-w-md"
						onChange={(e) =>
							setInfo((i) => ({ ...i, accountName: e.target.value }))
						}
					/>
				</label>

				<label className="label w-3/4">
					<p>Số Tài Khoản:</p>
					<input
						type="text"
						placeholder="Nhập số tài khoản/ví điện tử của bạn"
						className="input input-bordered w-full max-w-md"
						onChange={(e) =>
							setInfo((i) => ({ ...i, accountNumber: e.target.value }))
						}
					/>
				</label>

				<label className="label w-3/4">
					<p>Nhập Số Tiền (VND):</p>
					<input
						type="text"
						className="input input-bordered w-full max-w-md"
						onChange={(e) => setInfo((i) => ({ ...i, amount: e.target.value }))}
					/>
				</label>

				<label className="label w-3/4">
					<p>Số Thỏi Vàng:</p>
					<input
						type="text"
						className="input input-bordered w-full max-w-md"
						value={(info?.amount ?? 0) * 0.0062}
						disabled
					/>
				</label>

				<div className="flex flex-col gap-2 w-3/4">
					<button
						className="btn btn-lg"
						onClick={handleRutBank}>
						RÚT NGAY
					</button>
				</div>
			</div>
			<dialog
				id="err-bank"
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
				id="success-bank"
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

function HistoryUserBet() {
	const user = useAppSelector((state) => state.user);
	const [userBet, setUsetBet] = useState([]);

	useEffect(() => {
		const getUserBet = async () => {
			const res = await apiClient.get('/user/bets/log?page=1&limit=10', {
				headers: {
					Authorization: 'Bearer ' + user?.token,
				},
			});
			console.log(res.data);
			setUsetBet(res.data.data);
		};
		if (user) {
			getUserBet();
		}
	}, [user]);

	return (
		<div className="lg:flex lg:flex-col grid gap-1 max-w-">
			<div className="border-current border rounded-box grid h-20 place-items-center">
				Lịch Sử Cược
			</div>
			<div className="overflow-auto border border-current max-h-[600px]">
				<table className="table table-lg table-pin-rows table-pin-cols">
					{/* head */}
					<thead className="text-sm  text-center">
						<tr>
							<th>Server</th>
							<th>Nhân Vật</th>
							<th>Thỏi Vàng Cược</th>
							<th>Dự Đoán</th>
							<th>Kết Quả</th>
							<th>Thỏi Vàng Nhận</th>
							<th>Tình Trạng</th>
							<th>Thời gian</th>
						</tr>
					</thead>
					<tbody className="text-sm text-center text-nowrap">
						{/* row 1 */}
						{userBet?.map((userBet: any) => {
							const {
								amount,
								isEnd,
								receive,
								server,
								uid,
								createdAt = new Date(),
								betId,
								_id,
							} = userBet;
							const result = userBet.result;
							let resultBet = userBet.resultBet?.split('-');
							let new_result =
								result in TranslateKey ? TranslateKey[`${result}`] : result;
							let new_resultBet =
								resultBet[0] in TranslateKey
									? TranslateKey[`${resultBet[0]}`]
									: resultBet[0];
							let new_resultBet_concat = [new_resultBet, resultBet[1]].join(
								'-',
							);
							return (
								<tr
									className="hover"
									key={userBet._id}>
									<td>{server.replace('-mini', ' Sao')}</td>
									<td>{user?.username}</td>
									<td>{new Intl.NumberFormat('vi').format(amount)}</td>
									<td>{new_result}</td>
									<td>{new_resultBet_concat}</td>
									<td>{new Intl.NumberFormat('vi').format(receive)}</td>
									<td>
										{isEnd && receive > 0 ? (
											'Đã Thanh Toán'
										) : !isEnd ? (
											<span className="loading loading-dots loading-sm"></span>
										) : (
											'Đã Thua'
										)}
									</td>
									<td>{moment(createdAt).format('DD/MM/YYYY HH:mm:ss')}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* <div className="flex flex-row justify-between w-full">
				<div className="flex flex-row items-center gap-2">
					<p className="text-nowrap">Hiển Thị:</p>
					<select
						defaultValue={'all'}
						className="select select-bordered w-full">
						<option value={'all'}>Tất cả</option>
						<option value={'only'}>Chỉ mình tôi</option>
					</select>
				</div>
				<div className="flex flex-row items-center gap-2">
					<p className="text-nowrap">Dòng:</p>
					<select
						defaultValue={'10'}
						className="select select-bordered w-full"
						onChange={(e) => changeRowTable(e.target.value)}>
						<option value={'10'}>10</option>
						<option value={'25'}>25</option>
						<option value={'50'}>50</option>
					</select>
				</div>
			</div> */}
		</div>
	);
}

interface TypeTradeUser {
	type?: string;
	amount?: any;
	user?: any;
}

function TradeOtherUser() {
	const user = useAppSelector((state) => state.user);
	const [msg, setMsg] = useState('');
	const [info, setInfo] = useState<TypeTradeUser>({ type: 'uid' });

	const handleNapBank = async () => {
		try {
			const modal = document.getElementById('lock') as HTMLDialogElement | null;
			if (modal) {
				return modal.showModal();
			}
			if (!containsLettersAndSpecialChars(info?.amount)) {
				const modal = document.getElementById(
					'err-trade',
				) as HTMLDialogElement | null;
				if (modal) {
					setMsg('Xin vui lòng chỉ nhập chữ số ở trường Nhập Số Tiền');
					return modal.showModal();
				}
			}
		} catch (err) {
			const modal = document.getElementById(
				'err-trade',
			) as HTMLDialogElement | null;
			if (modal) {
				setMsg('Đã xảy ra lỗi, xin vui lòng thử lại sau chút lát!');
				return modal.showModal();
			}
		}
	};

	return (
		<div className="flex flex-col gap-5 items-start p-4 w-full">
			<h1 className="uppercase text-3xl pb-2 border-b-2 border-current">
				Chuyển Thỏi Vàng
			</h1>
			<div className="flex flex-col gap-2 w-full p-4 rounded-md bg-base-300">
				<p>
					Bạn chỉ có thể chuyển tới những người chơi ở{' '}
					<span className="text-error">Server {user?.server}</span>
				</p>
			</div>
			<div className="flex flex-col gap-4 items-center justify-center w-full">
				<label className="label w-3/4">
					<p>ID Tài Khoản:</p>
					<input
						type="text"
						placeholder="Type here"
						className="input input-bordered w-full max-w-md"
						disabled
						value={user._id}
					/>
				</label>

				<label className="label w-3/4">
					<p>Tên Tài Khoản:</p>
					<input
						type="text"
						placeholder="Type here"
						className="input input-bordered w-full max-w-md"
						disabled
						value={user.username}
					/>
				</label>

				<label className="label w-3/4">
					<p>Hình Thức:</p>
					<select
						defaultValue={'uid'}
						className="select select-bordered w-full max-w-md select-md"
						onChange={(e) => setInfo((i) => ({ ...i, type: e.target.value }))}>
						<option value="name">Tên Hiển Thị</option>
						<option value={'username'}>Tên tài khoản</option>
						<option
							selected
							value={'uid'}>
							ID Tài Khoản
						</option>
					</select>
				</label>

				<label className="label w-3/4">
					<p>Nhập Thông tin người nhận:</p>
					<input
						type="text"
						className="input input-bordered w-full max-w-md"
						onChange={(e) => setInfo((i) => ({ ...i, user: e.target.value }))}
					/>
				</label>

				<label className="label w-3/4">
					<p>Nhập Số Thỏi Vàng:</p>
					<input
						type="text"
						className="input input-bordered w-full max-w-md"
						onChange={(e) => setInfo((i) => ({ ...i, amount: e.target.value }))}
					/>
				</label>

				<div className="flex flex-col gap-2 w-3/4">
					<button
						className="btn btn-lg"
						onClick={handleNapBank}>
						CHUYỂN NGAY
					</button>
				</div>
			</div>
			<dialog
				id="lock"
				className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Thông Báo Người Chơi</h3>
					<p className="py-4">
						Chức Năng Chuyển Vàng Hiện Đóng, xin vui lòng thử lại sau!
					</p>
					<div className="modal-action">
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button className="btn">Đóng</button>
						</form>
					</div>
				</div>
			</dialog>
			<dialog
				id="err-trade"
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

function containsLettersAndSpecialChars(str: string) {
	const hasLetters = /[a-zA-Z]/.test(str);
	const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(str);
	return !hasLetters && !hasSpecialChars;
}

const ListBank = [
	{
		id: 17,
		name: 'Ngân hàng TMCP Công thương Việt Nam',
		code: 'ICB',
		bin: '970415',
		shortName: 'VietinBank',
		logo: 'https://api.vietqr.io/img/ICB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'VietinBank',
		support: 3,
		isTransfer: 1,
		swift_code: 'ICBVVNVX',
	},
	{
		id: 43,
		name: 'Ngân hàng TMCP Ngoại Thương Việt Nam',
		code: 'VCB',
		bin: '970436',
		shortName: 'Vietcombank',
		logo: 'https://api.vietqr.io/img/VCB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'Vietcombank',
		support: 3,
		isTransfer: 1,
		swift_code: 'BFTVVNVX',
	},
	{
		id: 4,
		name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
		code: 'BIDV',
		bin: '970418',
		shortName: 'BIDV',
		logo: 'https://api.vietqr.io/img/BIDV.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'BIDV',
		support: 3,
		isTransfer: 1,
		swift_code: 'BIDVVNVX',
	},
	{
		id: 42,
		name: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam',
		code: 'VBA',
		bin: '970405',
		shortName: 'Agribank',
		logo: 'https://api.vietqr.io/img/VBA.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'Agribank',
		support: 3,
		isTransfer: 1,
		swift_code: 'VBAAVNVX',
	},
	{
		id: 26,
		name: 'Ngân hàng TMCP Phương Đông',
		code: 'OCB',
		bin: '970448',
		shortName: 'OCB',
		logo: 'https://api.vietqr.io/img/OCB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'OCB',
		support: 3,
		isTransfer: 1,
		swift_code: 'ORCOVNVX',
	},
	{
		id: 21,
		name: 'Ngân hàng TMCP Quân đội',
		code: 'MB',
		bin: '970422',
		shortName: 'MBBank',
		logo: 'https://api.vietqr.io/img/MB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'MBBank',
		support: 3,
		isTransfer: 1,
		swift_code: 'MSCBVNVX',
	},
	{
		id: 38,
		name: 'Ngân hàng TMCP Kỹ thương Việt Nam',
		code: 'TCB',
		bin: '970407',
		shortName: 'Techcombank',
		logo: 'https://api.vietqr.io/img/TCB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'Techcombank',
		support: 3,
		isTransfer: 1,
		swift_code: 'VTCBVNVX',
	},
	{
		id: 2,
		name: 'Ngân hàng TMCP Á Châu',
		code: 'ACB',
		bin: '970416',
		shortName: 'ACB',
		logo: 'https://api.vietqr.io/img/ACB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'ACB',
		support: 3,
		isTransfer: 1,
		swift_code: 'ASCBVNVX',
	},
	{
		id: 47,
		name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng',
		code: 'VPB',
		bin: '970432',
		shortName: 'VPBank',
		logo: 'https://api.vietqr.io/img/VPB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'VPBank',
		support: 3,
		isTransfer: 1,
		swift_code: 'VPBKVNVX',
	},
	{
		id: 39,
		name: 'Ngân hàng TMCP Tiên Phong',
		code: 'TPB',
		bin: '970423',
		shortName: 'TPBank',
		logo: 'https://api.vietqr.io/img/TPB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'TPBank',
		support: 3,
		isTransfer: 1,
		swift_code: 'TPBVVNVX',
	},
	{
		id: 36,
		name: 'Ngân hàng TMCP Sài Gòn Thương Tín',
		code: 'STB',
		bin: '970403',
		shortName: 'Sacombank',
		logo: 'https://api.vietqr.io/img/STB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'Sacombank',
		support: 3,
		isTransfer: 1,
		swift_code: 'SGTTVNVX',
	},
	{
		id: 12,
		name: 'Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh',
		code: 'HDB',
		bin: '970437',
		shortName: 'HDBank',
		logo: 'https://api.vietqr.io/img/HDB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'HDBank',
		support: 3,
		isTransfer: 1,
		swift_code: 'HDBCVNVX',
	},
	{
		id: 44,
		name: 'Ngân hàng TMCP Bản Việt',
		code: 'VCCB',
		bin: '970454',
		shortName: 'VietCapitalBank',
		logo: 'https://api.vietqr.io/img/VCCB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'VietCapitalBank',
		support: 3,
		isTransfer: 1,
		swift_code: 'VCBCVNVX',
	},
	{
		id: 31,
		name: 'Ngân hàng TMCP Sài Gòn',
		code: 'SCB',
		bin: '970429',
		shortName: 'SCB',
		logo: 'https://api.vietqr.io/img/SCB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'SCB',
		support: 3,
		isTransfer: 1,
		swift_code: 'SACLVNVX',
	},
	{
		id: 45,
		name: 'Ngân hàng TMCP Quốc tế Việt Nam',
		code: 'VIB',
		bin: '970441',
		shortName: 'VIB',
		logo: 'https://api.vietqr.io/img/VIB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'VIB',
		support: 3,
		isTransfer: 1,
		swift_code: 'VNIBVNVX',
	},
	{
		id: 35,
		name: 'Ngân hàng TMCP Sài Gòn - Hà Nội',
		code: 'SHB',
		bin: '970443',
		shortName: 'SHB',
		logo: 'https://api.vietqr.io/img/SHB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'SHB',
		support: 3,
		isTransfer: 1,
		swift_code: 'SHBAVNVX',
	},
	{
		id: 10,
		name: 'Ngân hàng TMCP Xuất Nhập khẩu Việt Nam',
		code: 'EIB',
		bin: '970431',
		shortName: 'Eximbank',
		logo: 'https://api.vietqr.io/img/EIB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'Eximbank',
		support: 3,
		isTransfer: 1,
		swift_code: 'EBVIVNVX',
	},
	{
		id: 22,
		name: 'Ngân hàng TMCP Hàng Hải',
		code: 'MSB',
		bin: '970426',
		shortName: 'MSB',
		logo: 'https://api.vietqr.io/img/MSB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'MSB',
		support: 3,
		isTransfer: 1,
		swift_code: 'MCOBVNVX',
	},
	{
		id: 53,
		name: 'TMCP Việt Nam Thịnh Vượng - Ngân hàng số CAKE by VPBank',
		code: 'CAKE',
		bin: '546034',
		shortName: 'CAKE',
		logo: 'https://api.vietqr.io/img/CAKE.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'CAKE',
		support: 3,
		isTransfer: 1,
		swift_code: null,
	},
	{
		id: 54,
		name: 'TMCP Việt Nam Thịnh Vượng - Ngân hàng số Ubank by VPBank',
		code: 'Ubank',
		bin: '546035',
		shortName: 'Ubank',
		logo: 'https://api.vietqr.io/img/UBANK.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'Ubank',
		support: 3,
		isTransfer: 1,
		swift_code: null,
	},
	{
		id: 58,
		name: 'Ngân hàng số Timo by Ban Viet Bank (Timo by Ban Viet Bank)',
		code: 'TIMO',
		bin: '963388',
		shortName: 'Timo',
		logo: 'https://vietqr.net/portal-service/resources/icons/TIMO.png',
		transferSupported: 1,
		lookupSupported: 0,
		short_name: 'Timo',
		support: 0,
		isTransfer: 1,
		swift_code: null,
	},
	{
		id: 57,
		name: 'Tổng Công ty Dịch vụ số Viettel - Chi nhánh tập đoàn công nghiệp viễn thông Quân Đội',
		code: 'VTLMONEY',
		bin: '971005',
		shortName: 'ViettelMoney',
		logo: 'https://api.vietqr.io/img/VIETTELMONEY.png',
		transferSupported: 0,
		lookupSupported: 1,
		short_name: 'ViettelMoney',
		support: 0,
		isTransfer: 0,
		swift_code: null,
	},
	{
		id: 56,
		name: 'VNPT Money',
		code: 'VNPTMONEY',
		bin: '971011',
		shortName: 'VNPTMoney',
		logo: 'https://api.vietqr.io/img/VNPTMONEY.png',
		transferSupported: 0,
		lookupSupported: 1,
		short_name: 'VNPTMoney',
		support: 0,
		isTransfer: 0,
		swift_code: null,
	},
	{
		id: 34,
		name: 'Ngân hàng TMCP Sài Gòn Công Thương',
		code: 'SGICB',
		bin: '970400',
		shortName: 'SaigonBank',
		logo: 'https://api.vietqr.io/img/SGICB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'SaigonBank',
		support: 3,
		isTransfer: 1,
		swift_code: 'SBITVNVX',
	},
	{
		id: 3,
		name: 'Ngân hàng TMCP Bắc Á',
		code: 'BAB',
		bin: '970409',
		shortName: 'BacABank',
		logo: 'https://api.vietqr.io/img/BAB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'BacABank',
		support: 3,
		isTransfer: 1,
		swift_code: 'NASCVNVX',
	},
	{
		id: 30,
		name: 'Ngân hàng TMCP Đại Chúng Việt Nam',
		code: 'PVCB',
		bin: '970412',
		shortName: 'PVcomBank',
		logo: 'https://api.vietqr.io/img/PVCB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'PVcomBank',
		support: 3,
		isTransfer: 1,
		swift_code: 'WBVNVNVX',
	},
	{
		id: 27,
		name: 'Ngân hàng Thương mại TNHH MTV Đại Dương',
		code: 'Oceanbank',
		bin: '970414',
		shortName: 'Oceanbank',
		logo: 'https://api.vietqr.io/img/OCEANBANK.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'Oceanbank',
		support: 3,
		isTransfer: 1,
		swift_code: 'OCBKUS3M',
	},
	{
		id: 24,
		name: 'Ngân hàng TMCP Quốc Dân',
		code: 'NCB',
		bin: '970419',
		shortName: 'NCB',
		logo: 'https://api.vietqr.io/img/NCB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'NCB',
		support: 3,
		isTransfer: 1,
		swift_code: 'NVBAVNVX',
	},
	{
		id: 37,
		name: 'Ngân hàng TNHH MTV Shinhan Việt Nam',
		code: 'SHBVN',
		bin: '970424',
		shortName: 'ShinhanBank',
		logo: 'https://api.vietqr.io/img/SHBVN.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'ShinhanBank',
		support: 3,
		isTransfer: 1,
		swift_code: 'SHBKVNVX',
	},
	{
		id: 1,
		name: 'Ngân hàng TMCP An Bình',
		code: 'ABB',
		bin: '970425',
		shortName: 'ABBANK',
		logo: 'https://api.vietqr.io/img/ABB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'ABBANK',
		support: 3,
		isTransfer: 1,
		swift_code: 'ABBKVNVX',
	},
	{
		id: 41,
		name: 'Ngân hàng TMCP Việt Á',
		code: 'VAB',
		bin: '970427',
		shortName: 'VietABank',
		logo: 'https://api.vietqr.io/img/VAB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'VietABank',
		support: 3,
		isTransfer: 1,
		swift_code: 'VNACVNVX',
	},
	{
		id: 23,
		name: 'Ngân hàng TMCP Nam Á',
		code: 'NAB',
		bin: '970428',
		shortName: 'NamABank',
		logo: 'https://api.vietqr.io/img/NAB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'NamABank',
		support: 3,
		isTransfer: 1,
		swift_code: 'NAMAVNVX',
	},
	{
		id: 29,
		name: 'Ngân hàng TMCP Xăng dầu Petrolimex',
		code: 'PGB',
		bin: '970430',
		shortName: 'PGBank',
		logo: 'https://api.vietqr.io/img/PGB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'PGBank',
		support: 3,
		isTransfer: 1,
		swift_code: 'PGBLVNVX',
	},
	{
		id: 46,
		name: 'Ngân hàng TMCP Việt Nam Thương Tín',
		code: 'VIETBANK',
		bin: '970433',
		shortName: 'VietBank',
		logo: 'https://api.vietqr.io/img/VIETBANK.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'VietBank',
		support: 3,
		isTransfer: 1,
		swift_code: 'VNTTVNVX',
	},
	{
		id: 5,
		name: 'Ngân hàng TMCP Bảo Việt',
		code: 'BVB',
		bin: '970438',
		shortName: 'BaoVietBank',
		logo: 'https://api.vietqr.io/img/BVB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'BaoVietBank',
		support: 3,
		isTransfer: 1,
		swift_code: 'BVBVVNVX',
	},
	{
		id: 33,
		name: 'Ngân hàng TMCP Đông Nam Á',
		code: 'SEAB',
		bin: '970440',
		shortName: 'SeABank',
		logo: 'https://api.vietqr.io/img/SEAB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'SeABank',
		support: 3,
		isTransfer: 1,
		swift_code: 'SEAVVNVX',
	},
	{
		id: 52,
		name: 'Ngân hàng Hợp tác xã Việt Nam',
		code: 'COOPBANK',
		bin: '970446',
		shortName: 'COOPBANK',
		logo: 'https://api.vietqr.io/img/COOPBANK.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'COOPBANK',
		support: 3,
		isTransfer: 1,
		swift_code: null,
	},
	{
		id: 20,
		name: 'Ngân hàng TMCP Bưu Điện Liên Việt',
		code: 'LPB',
		bin: '970449',
		shortName: 'LienVietPostBank',
		logo: 'https://api.vietqr.io/img/LPB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'LienVietPostBank',
		support: 3,
		isTransfer: 1,
		swift_code: 'LVBKVNVX',
	},
	{
		id: 19,
		name: 'Ngân hàng TMCP Kiên Long',
		code: 'KLB',
		bin: '970452',
		shortName: 'KienLongBank',
		logo: 'https://api.vietqr.io/img/KLB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'KienLongBank',
		support: 3,
		isTransfer: 1,
		swift_code: 'KLBKVNVX',
	},
	{
		id: 55,
		name: 'Ngân hàng Đại chúng TNHH Kasikornbank',
		code: 'KBank',
		bin: '668888',
		shortName: 'KBank',
		logo: 'https://api.vietqr.io/img/KBANK.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'KBank',
		support: 3,
		isTransfer: 1,
		swift_code: 'KASIVNVX',
	},
	{
		id: 50,
		name: 'Ngân hàng Kookmin - Chi nhánh Hà Nội',
		code: 'KBHN',
		bin: '970462',
		shortName: 'KookminHN',
		logo: 'https://api.vietqr.io/img/KBHN.png',
		transferSupported: 0,
		lookupSupported: 0,
		short_name: 'KookminHN',
		support: 0,
		isTransfer: 0,
		swift_code: null,
	},
	{
		id: 60,
		name: 'Ngân hàng KEB Hana – Chi nhánh Thành phố Hồ Chí Minh',
		code: 'KEBHANAHCM',
		bin: '970466',
		shortName: 'KEBHanaHCM',
		logo: 'https://api.vietqr.io/img/KEBHANAHCM.png',
		transferSupported: 0,
		lookupSupported: 0,
		short_name: 'KEBHanaHCM',
		support: 0,
		isTransfer: 0,
		swift_code: null,
	},
	{
		id: 61,
		name: 'Ngân hàng KEB Hana – Chi nhánh Hà Nội',
		code: 'KEBHANAHN',
		bin: '970467',
		shortName: 'KEBHANAHN',
		logo: 'https://api.vietqr.io/img/KEBHANAHN.png',
		transferSupported: 0,
		lookupSupported: 0,
		short_name: 'KEBHANAHN',
		support: 0,
		isTransfer: 0,
		swift_code: null,
	},
	{
		id: 62,
		name: 'Công ty Tài chính TNHH MTV Mirae Asset (Việt Nam) ',
		code: 'MAFC',
		bin: '977777',
		shortName: 'MAFC',
		logo: 'https://api.vietqr.io/img/MAFC.png',
		transferSupported: 0,
		lookupSupported: 0,
		short_name: 'MAFC',
		support: 0,
		isTransfer: 0,
		swift_code: null,
	},
	{
		id: 59,
		name: 'Ngân hàng Citibank, N.A. - Chi nhánh Hà Nội',
		code: 'CITIBANK',
		bin: '533948',
		shortName: 'Citibank',
		logo: 'https://api.vietqr.io/img/CITIBANK.png',
		transferSupported: 0,
		lookupSupported: 0,
		short_name: 'Citibank',
		support: 0,
		isTransfer: 0,
		swift_code: null,
	},
	{
		id: 51,
		name: 'Ngân hàng Kookmin - Chi nhánh Thành phố Hồ Chí Minh',
		code: 'KBHCM',
		bin: '970463',
		shortName: 'KookminHCM',
		logo: 'https://api.vietqr.io/img/KBHCM.png',
		transferSupported: 0,
		lookupSupported: 0,
		short_name: 'KookminHCM',
		support: 0,
		isTransfer: 0,
		swift_code: null,
	},
	{
		id: 63,
		name: 'Ngân hàng Chính sách Xã hội',
		code: 'VBSP',
		bin: '999888',
		shortName: 'VBSP',
		logo: 'https://api.vietqr.io/img/VBSP.png',
		transferSupported: 0,
		lookupSupported: 0,
		short_name: 'VBSP',
		support: 0,
		isTransfer: 0,
		swift_code: null,
	},
	{
		id: 49,
		name: 'Ngân hàng TNHH MTV Woori Việt Nam',
		code: 'WVN',
		bin: '970457',
		shortName: 'Woori',
		logo: 'https://api.vietqr.io/img/WVN.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'Woori',
		support: 0,
		isTransfer: 1,
		swift_code: null,
	},
	{
		id: 48,
		name: 'Ngân hàng Liên doanh Việt - Nga',
		code: 'VRB',
		bin: '970421',
		shortName: 'VRB',
		logo: 'https://api.vietqr.io/img/VRB.png',
		transferSupported: 0,
		lookupSupported: 1,
		short_name: 'VRB',
		support: 0,
		isTransfer: 0,
		swift_code: null,
	},
	{
		id: 40,
		name: 'Ngân hàng United Overseas - Chi nhánh TP. Hồ Chí Minh',
		code: 'UOB',
		bin: '970458',
		shortName: 'UnitedOverseas',
		logo: 'https://api.vietqr.io/img/UOB.png',
		transferSupported: 0,
		lookupSupported: 1,
		short_name: 'UnitedOverseas',
		support: 0,
		isTransfer: 0,
		swift_code: null,
	},
	{
		id: 32,
		name: 'Ngân hàng TNHH MTV Standard Chartered Bank Việt Nam',
		code: 'SCVN',
		bin: '970410',
		shortName: 'StandardChartered',
		logo: 'https://api.vietqr.io/img/SCVN.png',
		transferSupported: 0,
		lookupSupported: 1,
		short_name: 'StandardChartered',
		support: 0,
		isTransfer: 0,
		swift_code: 'SCBLVNVX',
	},
	{
		id: 28,
		name: 'Ngân hàng TNHH MTV Public Việt Nam',
		code: 'PBVN',
		bin: '970439',
		shortName: 'PublicBank',
		logo: 'https://api.vietqr.io/img/PBVN.png',
		transferSupported: 0,
		lookupSupported: 1,
		short_name: 'PublicBank',
		support: 0,
		isTransfer: 0,
		swift_code: 'VIDPVNVX',
	},
	{
		id: 25,
		name: 'Ngân hàng Nonghyup - Chi nhánh Hà Nội',
		code: 'NHB HN',
		bin: '801011',
		shortName: 'Nonghyup',
		logo: 'https://api.vietqr.io/img/NHB.png',
		transferSupported: 0,
		lookupSupported: 0,
		short_name: 'Nonghyup',
		support: 0,
		isTransfer: 0,
		swift_code: null,
	},
	{
		id: 18,
		name: 'Ngân hàng TNHH Indovina',
		code: 'IVB',
		bin: '970434',
		shortName: 'IndovinaBank',
		logo: 'https://api.vietqr.io/img/IVB.png',
		transferSupported: 0,
		lookupSupported: 1,
		short_name: 'IndovinaBank',
		support: 0,
		isTransfer: 0,
		swift_code: null,
	},
	{
		id: 16,
		name: 'Ngân hàng Công nghiệp Hàn Quốc - Chi nhánh TP. Hồ Chí Minh',
		code: 'IBK - HCM',
		bin: '970456',
		shortName: 'IBKHCM',
		logo: 'https://api.vietqr.io/img/IBK.png',
		transferSupported: 0,
		lookupSupported: 0,
		short_name: 'IBKHCM',
		support: 0,
		isTransfer: 0,
		swift_code: null,
	},
	{
		id: 15,
		name: 'Ngân hàng Công nghiệp Hàn Quốc - Chi nhánh Hà Nội',
		code: 'IBK - HN',
		bin: '970455',
		shortName: 'IBKHN',
		logo: 'https://api.vietqr.io/img/IBK.png',
		transferSupported: 0,
		lookupSupported: 0,
		short_name: 'IBKHN',
		support: 0,
		isTransfer: 0,
		swift_code: null,
	},
	{
		id: 14,
		name: 'Ngân hàng TNHH MTV HSBC (Việt Nam)',
		code: 'HSBC',
		bin: '458761',
		shortName: 'HSBC',
		logo: 'https://api.vietqr.io/img/HSBC.png',
		transferSupported: 0,
		lookupSupported: 1,
		short_name: 'HSBC',
		support: 0,
		isTransfer: 0,
		swift_code: 'HSBCVNVX',
	},
	{
		id: 13,
		name: 'Ngân hàng TNHH MTV Hong Leong Việt Nam',
		code: 'HLBVN',
		bin: '970442',
		shortName: 'HongLeong',
		logo: 'https://api.vietqr.io/img/HLBVN.png',
		transferSupported: 0,
		lookupSupported: 1,
		short_name: 'HongLeong',
		support: 0,
		isTransfer: 0,
		swift_code: 'HLBBVNVX',
	},
	{
		id: 11,
		name: 'Ngân hàng Thương mại TNHH MTV Dầu Khí Toàn Cầu',
		code: 'GPB',
		bin: '970408',
		shortName: 'GPBank',
		logo: 'https://api.vietqr.io/img/GPB.png',
		transferSupported: 0,
		lookupSupported: 1,
		short_name: 'GPBank',
		support: 0,
		isTransfer: 0,
		swift_code: 'GBNKVNVX',
	},
	{
		id: 9,
		name: 'Ngân hàng TMCP Đông Á',
		code: 'DOB',
		bin: '970406',
		shortName: 'DongABank',
		logo: 'https://api.vietqr.io/img/DOB.png',
		transferSupported: 0,
		lookupSupported: 1,
		short_name: 'DongABank',
		support: 0,
		isTransfer: 0,
		swift_code: 'EACBVNVX',
	},
	{
		id: 8,
		name: 'DBS Bank Ltd - Chi nhánh Thành phố Hồ Chí Minh',
		code: 'DBS',
		bin: '796500',
		shortName: 'DBSBank',
		logo: 'https://api.vietqr.io/img/DBS.png',
		transferSupported: 0,
		lookupSupported: 0,
		short_name: 'DBSBank',
		support: 0,
		isTransfer: 0,
		swift_code: 'DBSSVNVX',
	},
	{
		id: 7,
		name: 'Ngân hàng TNHH MTV CIMB Việt Nam',
		code: 'CIMB',
		bin: '422589',
		shortName: 'CIMB',
		logo: 'https://api.vietqr.io/img/CIMB.png',
		transferSupported: 1,
		lookupSupported: 1,
		short_name: 'CIMB',
		support: 0,
		isTransfer: 1,
		swift_code: 'CIBBVNVN',
	},
	{
		id: 6,
		name: 'Ngân hàng Thương mại TNHH MTV Xây dựng Việt Nam',
		code: 'CBB',
		bin: '970444',
		shortName: 'CBBank',
		logo: 'https://api.vietqr.io/img/CBB.png',
		transferSupported: 0,
		lookupSupported: 1,
		short_name: 'CBBank',
		support: 0,
		isTransfer: 0,
		swift_code: 'GTBAVNVX',
	},
];
