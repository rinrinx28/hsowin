'use client';

import ChatBox from '@/components/Chat';
import { BetMinigame, Minigame } from '@/components/Minigame';
import TableResult from '@/components/TableResult';
import TableUser from '@/components/TableUser';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hook';
import { updateUserGame } from '@/lib/redux/features/Minigame/userGameSlice';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Typewriter from 'typewriter-effect';
import ImageLoader from '@/lib/ImageLoader';
import Image from 'next/image';
import moment from 'moment';
import { useSocket } from '@/lib/socket';
import { IoIosStarHalf } from 'react-icons/io';
import TableClans from '@/components/TableClans';
import { MdMenuBook } from 'react-icons/md';
import { IoBookmarksOutline, IoGameController } from 'react-icons/io5';
import { FaFacebook, FaMusic } from 'react-icons/fa';
import { AiFillLike } from 'react-icons/ai';
import apiClient from '@/lib/apiClient';
import TextMarquee from '@/components/TextMarquee';

interface TopBank {
	uid: string;
	username: string;
	amount: number;
}

const slogans = [
	'Mini Game Đỏ Đen Hồi Sinh Ngọc Rồng',
	'Chơi Mini Game, Nhận Vàng Ngay',
	'Tự Động - Ưu Đãi Hấp Dẫn - Uy Tín 100%',
	'Giao Dịch Tự Động - An Toàn & Chất Lượng',
];

export default function Home() {
	const user = useAppSelector((state) => state.user);
	const evenConfig = useAppSelector((state) => state.eventConfig);
	const diemDanhStore = useAppSelector((state) => state.diemDanhStore);
	const new_logo = ImageLoader('image/new.gif');
	const userGame = useAppSelector((state) => state.userGame);
	const [bank, setBank] = useState('');
	const [topBank, setTopBank] = useState<TopBank[]>([]);
	const dispatch = useAppDispatch();
	const [winner, setWinner] = useState(0);
	const [delay, setDelay] = useState(0);
	const [mem, setMem] = useState(0);
	const [prize, setPrize] = useState(0);
	const [text, setText] = useState<any>(null);
	const [link, setLink] = useState<string | null>(null);
	const [isShow, setShow] = useState<boolean>(false);

	const socket = useSocket();

	const showTutorial = () => {
		const modal = document.getElementById(
			'huongdan',
		) as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
	};

	const showError = () => {
		const modal = document.getElementById(
			'err-home-page',
		) as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
	};

	const handleDiemdanh = () => {
		if (!user?.token || !user?._id || !user?.isLogin) return showError();
		socket.emit('diem-danh', { uid: user?._id, token: user?.token });
	};

	useEffect(() => {
		if (!user?.isLogin) {
			const modal = document.getElementById(
				'wellcome',
			) as HTMLDialogElement | null;
			if (modal) {
				const e_bank_gold = evenConfig?.find((e) => e.name === 'e-bank-gold');
				setBank(`${(e_bank_gold?.value ?? 0) * 100}%`);
				modal.showModal();
			}
		}
	}, [user, evenConfig]);

	useEffect(() => {
		if (evenConfig) {
			const e_winner_diem_danh = evenConfig?.find(
				(e) => e.name === 'e-number-winner-diem-danh',
			);
			setWinner(e_winner_diem_danh?.value ?? 0);

			const e_time_delay_diem_danh = evenConfig?.find(
				(e) => e.name === 'e-time-delay-diem-danh',
			);
			setDelay(e_time_delay_diem_danh?.value ?? 0);

			const e_limited_diem_danh = evenConfig?.find(
				(e) => e.name === 'e-limited-diem-danh',
			);
			setMem(e_limited_diem_danh?.value ?? 0);

			const e_prize_diem_danh = evenConfig?.find(
				(e) => e.name === 'e-prize-diem-danh',
			);
			setPrize(e_prize_diem_danh?.value ?? 0);

			const e_banner_text = evenConfig?.find((e) => e.name === 'e-banner-text');
			setText(e_banner_text);

			const e_ybt = evenConfig?.find((e) => e.name === 'e-ybt');
			const id = e_ybt?.option ?? '';
			let url_ytb = `https://www.youtube.com/embed/${id}`;
			setLink(url_ytb);
		}
	}, [evenConfig]);

	useEffect(() => {
		const getTopBank = async () => {
			try {
				const res = await apiClient.get('/user/top-bank');
				const { data } = res;
				const { topBank }: { topBank: TopBank[] } = data;
				setTopBank(topBank);
			} catch (err: any) {
				return;
			}
		};
		getTopBank();
		let loop_info_top_bank = setInterval(() => {
			getTopBank();
		}, 15e3);
		return () => {
			clearInterval(loop_info_top_bank);
		};
	}, []);

	return (
		<div className="min-w-[300px] flex flex-col gap-5 py-5 px-2 transition-all">
			<div className="flex justify-center">
				<div className="max-w-6xl">
					<div className="flex flex-col justify-center items-center text-center">
						<h1 className="text-3xl font-bold text-primary">HSGAME.ME</h1>
						<div className="py-3 mb-4 lg:text-xl text-sm text-current border-b border-current">
							<Typewriter
								options={{
									strings: slogans,
									autoStart: true,
									loop: true,
									deleteSpeed: 1,
									delay: 50,
								}}
							/>
						</div>

						<div className="flex flex-col gap-4">
							<div className="flex flex-wrap lg:flex-row gap-4 justify-center">
								<div className="dropdown ">
									<div
										tabIndex={0}
										role="button"
										className="btn  btn-primary btn-outline rounded-btn">
										<MdMenuBook />
										Chức Năng
									</div>
									<ul
										tabIndex={0}
										className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
										{/* <li>
											<Link href={'/user?type=NAPBANKING'}>Mua Vàng</Link>
										</li> */}
										<li>
											<Link href={'/napvang'}>Nạp Vàng</Link>
										</li>
										<li>
											<Link href={'/rutvang'}>Rút Vàng</Link>
										</li>
										<li>
											<Link href={'/user'}>Thông Tin Cá Nhân</Link>
										</li>
										{/* <li>
											<Link href={'/user?type=RUTBANKING'}>Rút Về Bank</Link>
										</li> */}
										<li>
											<Link href={'/user?type=EXCHANGEGOLD'}>
												Đổi Lục Bảo - Thỏi Vàng
											</Link>
										</li>
										<li>
											<Link href={'/user?type=MISSIONDAILY'}>
												Nhiệm Vụ Hàng Ngày
											</Link>
										</li>

										<li>
											<Link
												className=""
												href={'/vip'}>
												Điểm Danh VIP
											</Link>
										</li>
									</ul>
								</div>
								<button
									onClick={showTutorial}
									className="btn btn-primary btn-outline rounded-btn">
									<IoBookmarksOutline /> Hướng Dẫn
								</button>
								<Link
									href={'https://www.facebook.com/groups/hsowin.vip'}
									target="_blank"
									className="btn btn-primary btn-outline rounded-btn">
									<FaFacebook />
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
									<AiFillLike />
									Điểm Danh
								</button>
							</div>
							<div className="flex flex-wrap lg:flex-row gap-4 justify-center">
								{/* <button
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
								</button> */}
								<button
									onClick={() => dispatch(updateUserGame('1'))}
									className={`${
										userGame === '1' ? 'btn-primary' : 'btn-outline'
									} btn rounded-btn`}>
									<IoGameController /> Map Boss Sv1
								</button>
								<button
									onClick={() => dispatch(updateUserGame('2'))}
									className={`${
										userGame === '2' ? 'btn-primary' : 'btn-outline'
									} btn rounded-btn`}>
									<IoGameController /> Map Boss Sv2
								</button>
								<button
									onClick={() => dispatch(updateUserGame('3'))}
									className={`${
										userGame === '3' ? 'btn-primary' : 'btn-outline'
									} btn rounded-btn`}>
									<IoGameController /> Map Boss Sv3
								</button>
								<button
									onClick={() => dispatch(updateUserGame('24'))}
									className={`${
										userGame === '24' ? 'btn-primary' : 'btn-outline'
									} btn rounded-btn`}>
									<IoGameController /> Server 24/24
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				{text && text?.status && (
					<div className="w-full flex items-center justify-center">
						<div className="w-full max-w-6xl p-2 overflow-hidden text-current text-nowrap transition-all ease-in duration-300">
							<TextMarquee
								text={JSON.parse(text?.option)
									?.map((t: string) => {
										return ` ${t} 💫 `;
									})
									.join(' ')}
								animationDuration={`30s`}
							/>
						</div>
					</div>
				)}
				{[...topBank].length > 0 && (
					<div className="w-full flex items-center justify-center">
						<div className="w-full max-w-6xl p-2 overflow-hidden text-current text-nowrap transition-all ease-in duration-300">
							<TextMarquee
								text={[...topBank]
									.map((t: TopBank, i: number) => {
										const golt = new Intl.NumberFormat('vi').format(t.amount);
										const name = t.username;
										return ` Top ${i + 1}: ${name} ${golt} 💫 `;
									})
									.join(' ')}
								animationDuration={`30s`}
							/>
						</div>
					</div>
				)}
			</div>
			<div className="flex justify-center">
				<div className="max-w-7xl grid lg:grid-cols-2 lg:grid-rows-5 grid-flow-row gap-4">
					<Minigame />
					<BetMinigame />
					<ChatBox />
				</div>
			</div>
			<div className="flex flex-col items-center p-2 w-full justify-center gap-4">
				<button
					onClick={() => setShow((e) => !e)}
					className="btn btn-primary btn-outline rounded-btn">
					<FaMusic />
					Nghe Nhạc
				</button>
				<div
					className={`${
						isShow ? 'flex' : 'hidden'
					} flex-col gap-2 items-center w-full justify-center`}>
					<div className="w-full max-w-[500px] max-h-[600]">
						<iframe
							className="w-full h-[400px] max-h-[500px]"
							src={link ?? ''}
							title="YouTube video player"
							allow="accelerometer; autoplay; loop; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
					</div>
				</div>
			</div>
			<div className="flex justify-center">
				<div className="max-w-7xl w-full flex flex-col gap-10">
					<TableResult />
					<TableClans />
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
							https://hsgame.me/
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
							- <span className="text-red-500">Dự đoán chẵn-lẻ</span>: kết quả{' '}
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
					<h3 className="font-bold text-lg">Chương Trình Khuyến Mãi</h3>
					<div className="py-4 flex flex-col gap-2">
						<Link
							href={'/login'}
							className="text-nowrap flex flex-row items-center gap-2 link link-hover text-primary font-semibold capitalize ">
							<Image
								src={new_logo}
								alt="new_logo_1"
								width={50}
								height={50}
								priority={true}
							/>
							Nhận ngay 10 thỏi vàng khi tạo tài khoản trên web
						</Link>
						<Link
							href={'/login'}
							className="text-nowrap flex flex-row items-center gap-2 link link-hover text-primary font-semibold capitalize ">
							<Image
								src={new_logo}
								alt="new_logo_2"
								width={50}
								height={50}
								priority={true}
							/>
							Tặng thỏi vàng miễn phí mỗi ngày
						</Link>
						<Link
							href={'/login'}
							className="text-nowrap flex flex-row items-center gap-2 link link-hover text-primary font-semibold capitalize ">
							<Image
								src={new_logo}
								alt="new_logo_3"
								width={50}
								height={50}
								priority={true}
							/>
							Nạp Thỏi Vàng tích điểm nhận thành viên VIP
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
				<div className="modal-box lg:max-w-3xl">
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
							✕
						</button>
					</form>
					<h3 className="font-bold text-lg">ĐIỂM DANH NHẬN VÀNG</h3>
					<div
						className="py-4 flex flex-col justify-center items-center gap-2"
						id="info-diem-danh">
						<p>
							Đang có{' '}
							<span
								className="text-primary font-extrabold"
								id="length-diem-danh">
								{diemDanhStore.count ?? 0}
							</span>{' '}
							người điểm danh
						</p>
						<p>Điểm danh hoàn toàn miễn phí ai cũng có thể tham gia!</p>
						<p>
							Phần quà hấp dẫn, với mỗi người trúng sẽ nhận được{' '}
							<span className="text-primary font-extrabold">
								{prize} thỏi vàng
							</span>{' '}
							hoặc{' '}
							<span className="text-primary font-extrabold">
								{prize * 3} Lục Bảo
							</span>
						</p>
						<p>
							Trao giải{' '}
							<span className="text-primary font-extrabold">
								{moment.utc(delay).format('mm:ss')} phút
							</span>{' '}
							1 lần cho{' '}
							<span className="text-primary font-extrabold">
								{winner} người may mắn
							</span>
						</p>
						<p>
							Hệ thống sẽ trao giải nếu có từ{' '}
							<span className="text-primary font-extrabold">{mem} người</span>{' '}
							điểm danh trở lên
						</p>
						<p>
							Thời gian diễn ra{' '}
							<span className="text-primary font-extrabold">24/7</span> hàng
							ngày
						</p>
						<button
							className="btn btn-outline"
							onClick={handleDiemdanh}>
							Tham Gia Điểm Danh
						</button>
					</div>
				</div>
			</dialog>
			<dialog
				id="err-home-page"
				className="modal">
				<div className="modal-box">
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
							✕
						</button>
					</form>
					<h3 className="font-bold text-lg">Thông báo người chơi</h3>
					<div
						className="py-4 flex flex-col justify-center items-center gap-2"
						id="info-diem-danh">
						<p>Bạn không thể điểm danh, xin vui lòng đăng nhập/đăng ký</p>
					</div>
				</div>
			</dialog>
			<dialog
				id="re-home-page"
				className="modal">
				<div className="modal-box">
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
							✕
						</button>
					</form>
					<h3 className="font-bold text-lg">Thông báo người chơi</h3>
					<div
						className="py-4 flex flex-col justify-center items-center gap-2"
						id="info-diem-danh-re"></div>
				</div>
			</dialog>
		</div>
	);
}
