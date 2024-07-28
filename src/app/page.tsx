'use client';

import ChatBox from '@/components/Chat';
import { BetMinigame, Minigame } from '@/components/Minigame';
import TableClans from '@/components/TableClans';
import TableResult from '@/components/TableResult';
import TableUser from '@/components/TableUser';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hook';
import { updateUserGame } from '@/lib/redux/features/Minigame/userGameSlice';

export default function Home() {
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

	return (
		<div className="min-w-[300px] flex flex-col gap-5 py-5 transition-all">
			<div className="flex justify-center">
				<div className="max-w-6xl">
					<div className="flex flex-col justify-center items-center text-center">
						<h1 className="text-4xl font-bold">HỆ THỐNG MINI GAME</h1>
						<p className="py-6 mb-4 border-b border-current">
							Kiếm Vàng <br /> Hồi Sinh Ngọc Rồng Giao Dịch Tự Động Uy Tín
						</p>
						<div className="flex flex-col gap-4">
							<div className="flex flex-wrap lg:flex-row gap-4 justify-center">
								<div className="dropdown ">
									<div
										tabIndex={0}
										role="button"
										className="btn  btn-neutral">
										Chức Năng
									</div>
									<ul
										tabIndex={0}
										className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
										<li>
											<p>Mua Vàng</p>
										</li>
										<li>
											<p>Nạp Vàng</p>
										</li>
										<li>
											<p>Nhiệm Vụ Hàng Ngày</p>
										</li>
										<li>
											<p>Nhập Giftcode</p>
										</li>
										<li>
											<p>Thông Tin Cá Nhân</p>
										</li>
										<li>
											<p>Chuyển Vàng</p>
										</li>
										<li>
											<p>Rút Về Bank</p>
										</li>
									</ul>
								</div>
								<button
									onClick={showTutorial}
									className="btn btn-primary btn-outline rounded-btn">
									Hướng Dẫn
								</button>
								<button className="btn btn-primary btn-outline rounded-btn">
									Group Facebook
								</button>
								<button className="btn btn-primary btn-outline rounded-btn">
									Điểm Danh
								</button>
							</div>
							<div className="flex flex-wrap lg:flex-row gap-4 justify-center">
								<button
									onClick={() => dispatch(updateUserGame('1-mini'))}
									className={`${
										userGame === '1-mini' ? '' : 'btn-outline'
									} btn rounded-btn`}>
									Server 1
								</button>
								<button
									onClick={() => dispatch(updateUserGame('2-mini'))}
									className={`${
										userGame === '2-mini' ? '' : 'btn-outline'
									} btn rounded-btn`}>
									Server 2
								</button>
								<button
									onClick={() => dispatch(updateUserGame('3-mini'))}
									className={`${
										userGame === '3-mini' ? '' : 'btn-outline'
									} btn rounded-btn`}>
									Server 3
								</button>
								<button
									onClick={() => dispatch(updateUserGame('1'))}
									className={`${
										userGame === '1' ? '' : 'btn-outline'
									} btn rounded-btn`}>
									Map Boss Sv1
								</button>
								<button
									onClick={() => dispatch(updateUserGame('2'))}
									className={`${
										userGame === '2' ? '' : 'btn-outline'
									} btn rounded-btn`}>
									Map Boss Sv2
								</button>
								<button
									onClick={() => dispatch(updateUserGame('3'))}
									className={`${
										userGame === '3' ? '' : 'btn-outline'
									} btn rounded-btn`}>
									Map Boss Sv3
								</button>
								<button
									onClick={() => dispatch(updateUserGame('24'))}
									className={`${
										userGame === '24' ? '' : 'btn-outline'
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
				<div className="modal-box">
					<h3 className="font-bold text-lg">Hướng dẫn</h3>
					<h3 className="font-semibold">
						{`Hệ thống chẳn lẻ Game Ngọc Rồng Online
					Lấy chức năng "Con số may mắn" trong game làm kết quả
					Bạn đều có thể đặt cược, lấy kết quả ở Server tùy thích`}
					</h3>
					<div className="py-4 flex flex-col gap-2">
						<p>Thể lệ gồm các trò chơi:</p>
						<p>- Dự đoán chẵn lẻ: kết quả số chẵn hoặc số lẻ</p>
						<p>Tỷ lệ: x1.9 (đặt 10tr được 19tr vàng)</p>
						<p>{`Ví dụ con số may mắn là 1 số chẵn như 0, 2, 4, 6, 8, 10, 12... 
						thì đặt bên Chẵn thắng, ngược lại con số may mắn là số lẻ như 1, 3, 5, 7, 9, 11...
						thì đặt bên Lẻ thắng`}</p>
						<p>{`- Dự đoán tài xỉu: kết quả từ 50-99 là tài còn từ 0-49 là xỉu`}</p>
						<p>Tỷ lệ: x1.9 (đặt 10tr được 19tr vàng)</p>
						<p>{`
						Ví dụ con số may mắn là 1 số từ 0-49 như 0, 1, 2, 35, 48, 49...
						thì đặt bên Xỉu thắng, ngược lại con số may mắn là
						1 số từ 50-99 như 50, 51, 52, 67, 87, 98, 99 thì đặt bên Tài thắng`}</p>
						<p>- Dự đoán kết quả: kết quả là con số may mắn từ 0 tới 99</p>
						<p>Tỷ lệ: x70 (đặt 10tr được 700tr vàng)</p>
						<p>Liên kết: Nạp vàng | Rút vàng</p>
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
