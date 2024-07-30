'use client';

import ChatBox from '@/components/Chat';
import { BetMinigame, Minigame } from '@/components/Minigame';
import TableResult from '@/components/TableResult';
import TableUser from '@/components/TableUser';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hook';
import { updateUserGame } from '@/lib/redux/features/Minigame/userGameSlice';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
	const user = useAppSelector((state) => state.user);
	const userGame = useAppSelector((state) => state.userGame);
	const dispatch = useAppDispatch();

	const showTutorial = () => {
		const modal = document.getElementById(
			'huongdan',
		) as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
	};

	useEffect(() => {
		if (!user.isLogin) {
			const modal = document.getElementById(
				'wellcome',
			) as HTMLDialogElement | null;
			if (modal) {
				modal.showModal();
			}
		}
	}, [user]);

	return (
		<div className="min-w-[300px] flex flex-col gap-5 py-5 transition-all">
			<div className="flex justify-center">
				<div className="max-w-6xl">
					<div className="flex flex-col justify-center items-center text-center">
						<h1 className="text-3xl font-bold">Hệ Thống HSOWIN</h1>
						<p className="py-6 mb-4 text-xl border-b border-current">
							Hồi Sinh Ngọc Rồng - MiniGame Kiếm Vàng
							<br />
							Giao Dịch - Tự Động - Uy Tín - Chất Lượng
						</p>
						<div className="flex flex-col gap-4">
							<div className="flex flex-wrap lg:flex-row gap-4 justify-center">
								<div className="dropdown ">
									<div
										tabIndex={0}
										role="button"
										className="btn  btn-primary btn-outline rounded-btn">
										Chức Năng
									</div>
									<ul
										tabIndex={0}
										className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
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
											<Link href={'/user'}>Thông Tin Cá Nhân</Link>
										</li>
										<li>
											<Link href={'/user?type=RUTBANKING'}>Rút Về Bank</Link>
										</li>
									</ul>
								</div>
								<button
									onClick={showTutorial}
									className="btn btn-primary btn-outline rounded-btn">
									Hướng Dẫn
								</button>
								<Link
									href={'https://www.facebook.com/groups/hsowin.vip'}
									target="_blank"
									className="btn btn-primary btn-outline rounded-btn">
									Group Facebook
								</Link>
								<button
									onClick={() => {
										const modal = document.getElementById(
											'penning',
										) as HTMLDialogElement | null;
										if (modal) {
											modal.showModal();
										}
									}}
									className="btn btn-primary btn-outline rounded-btn">
									Điểm Danh
								</button>
							</div>
							<div className="flex flex-wrap lg:flex-row gap-4 justify-center">
								<button
									onClick={() => dispatch(updateUserGame('1-mini'))}
									className={`${
										userGame === '1-mini' ? 'btn-success' : 'btn-outline'
									} btn rounded-btn`}>
									Server 1
								</button>
								<button
									onClick={() => dispatch(updateUserGame('2-mini'))}
									className={`${
										userGame === '2-mini' ? 'btn-success' : 'btn-outline'
									} btn rounded-btn`}>
									Server 2
								</button>
								<button
									onClick={() => dispatch(updateUserGame('3-mini'))}
									className={`${
										userGame === '3-mini' ? 'btn-success' : 'btn-outline'
									} btn rounded-btn`}>
									Server 3
								</button>
								<button
									onClick={() => dispatch(updateUserGame('1'))}
									className={`${
										userGame === '1' ? 'btn-success' : 'btn-outline'
									} btn rounded-btn`}>
									Map Boss Sv1
								</button>
								<button
									onClick={() => dispatch(updateUserGame('2'))}
									className={`${
										userGame === '2' ? 'btn-success' : 'btn-outline'
									} btn rounded-btn`}>
									Map Boss Sv2
								</button>
								<button
									onClick={() => dispatch(updateUserGame('3'))}
									className={`${
										userGame === '3' ? 'btn-success' : 'btn-outline'
									} btn rounded-btn`}>
									Map Boss Sv3
								</button>
								<button
									onClick={() => dispatch(updateUserGame('24'))}
									className={`${
										userGame === '24' ? 'btn-success' : 'btn-outline'
									} btn rounded-btn`}>
									Server 24/24
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-center">
				<div className="max-w-7xl grid lg:grid-cols-2 lg:grid-rows-5 grid-flow-row gap-4">
					<Minigame />
					<BetMinigame />
					<ChatBox />
				</div>
			</div>
			<div className="flex justify-center">
				<div className="max-w-7xl grid grid-rows-2 gap-10">
					<TableResult />
					{/* <TableClans /> */}
					<TableUser />
				</div>
			</div>
			<dialog
				id="huongdan"
				className="modal">
				<div className="modal-box max-w-xl">
					<h3 className="font-bold text-lg">Hướng dẫn</h3>
					<h3 className="font-semibold">
						Hệ thống chẵn lẻ game Hồi Sinh Ngọc Rồng:{' '}
						<Link
							href={'/'}
							className="link">
							https://hsowin.vip/
						</Link>
					</h3>
					<h3 className="font-semibold">
						<span>
							Lấy chức năng thông báo xuất hiện boss Tiểu Đội Sát Thủ trong game
							làm kết quả
						</span>
						<span>Bạn đều có thể đặt cược, lấy kết quả ở server tùy thích</span>
					</h3>
					<div className="py-4 flex flex-col gap-2">
						<p className="text-red-500">Thể lệ gồm các trò chơi: </p>
						<p className="text-primary">
							Lấy thời gian Boss chết cộng với số ngẫu nhiên để ra kết quả trò
							chơi
						</p>
						<p>
							- <span className="text-red-500">Dự đoán chẵn-lẻ</span>: kết quả
							<span className="font-semibold">số chẵn</span> hoặc{' '}
							<span className="font-semibold">số lẻ</span>
						</p>
						<p className="text-green-500">
							Tỷ lệ 1.9 (Đặt cược 10 thỏi vàng được 19 thỏi vàng)
						</p>
						<p>
							Ví dụ con số may mắn là 1 số chẵn như{' '}
							<span className="text-primary">0, 2, 4, 6, 8, 10, 12...</span> thì
							đặt bên <span className="text-primary">Chẵn thắng</span>, ngược
							lại con số may mắn là số lẻ như{' '}
							<span className="text-primary">1, 3, 5, 7, 9, 11...</span> thì đặt
							bên <span className="text-primary">Lẻ thắng</span>
						</p>
						<p>
							- <span className="text-red-500">Dự đoán tài xỉu</span>: kết quả
							được tính là 1 số cuối{' '}
							<span className="text-primary">5-9 là tài</span>{' '}
							<span className="text-primary">0-4 là xỉu</span>
						</p>
						<p className="text-green-500">
							Tỷ lệ: x1.9 (Đặt cược 10 thỏi vàng được 19 thỏi vàng)
						</p>
						<p>
							Ví dụ kết quả của con số là{' '}
							<span className="text-primary">35,16,27,58,09</span> thì kết quả
							được tính là 1 số cuối. Tương tự lần lượt là:{' '}
							<span className="text-primary">5-9 là bên Tài thắng</span>, ngược
							lại số cuối từ{' '}
							<span className="text-primary">0-4 sẽ là Xỉu thắng</span>
						</p>
						<p>
							- <span className="text-red-500">Dự đoán kết quả</span>: kết quả
							là con số may mắn từ 0 tới 99
						</p>
						<p className="text-green-500">
							Tỷ lệ: x70 (đặt 10 thỏi vàng được 700 thỏi vàng)
						</p>
						<p>
							Liên kết:{' '}
							<Link
								href={'/napvang'}
								className="link">
								Nạp vàng
							</Link>{' '}
							|{' '}
							<Link
								href={'/rutvang'}
								className="link">
								Rút vàng
							</Link>
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
				id="wellcome"
				className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Hướng dẫn</h3>
					<div className="py-4 flex flex-col gap-2">
						<Link
							href={'/login'}
							className="text-nowrap link link-hover text-primary font-semibold capitalize ">
							Nhận ngay 10 thỏi vàng khi tạo tài khoản trên web{' '}
						</Link>
						{/* <Link
							href={'/login'}
							className="text-nowrap link link-hover text-primary font-semibold capitalize ">
							Cập nhật gift code
						</Link> */}
						<Link
							href={'/login'}
							className="text-nowrap link link-hover text-primary font-semibold capitalize ">
							Tặng thỏi vàng miễn phí mỗi ngày
						</Link>
						{/* <Link
							href={'/login'}
							className="text-nowrap link link-hover text-primary font-semibold capitalize ">
							Ra mắt vòng quay nhận vàng miễn phí
						</Link> */}
						<Link
							href={'/login'}
							className="text-nowrap link link-hover text-primary font-semibold capitalize ">
							Nạp Thỏi Vàng khuyễn mãi lên đến x0,48% qua ví/atm
						</Link>
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
				id="penning"
				className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Thông Báo Người Chơi</h3>
					<div className="py-4 flex flex-col gap-2">
						<p>
							Xin lỗi tính năng đang được phát triển, xin vui lòng thử lại sau
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
		</div>
	);
}
