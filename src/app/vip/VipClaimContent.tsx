'use client';

import apiClient from '@/lib/apiClient';
import { updateUser } from '@/lib/redux/features/auth/user';
import { updateUserVip } from '@/lib/redux/features/auth/userVip';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VipClaimPage() {
	const user = useAppSelector((state) => state.user);
	const [msg, setMsg] = useState('');
	const dispath = useAppDispatch();
	const router = useRouter();

	const showModel = () => {
		const modal = document.getElementById(
			'claim-noti',
		) as HTMLDialogElement | null;
		if (modal) {
			return modal.showModal();
		}
	};

	useEffect(() => {
		const modal = document.getElementById(
			'claim-noti2',
		) as HTMLDialogElement | null;
		if (modal) {
			return modal.showModal();
		}
	}, []);

	return (
		<div className="min-h-screen flex w-full justify-center items-center">
			<div className="max-w-7xl w-full flex flex-col gap-5 items-center select-none">
				{(user?.vip ?? 0) > 0 && (
					<h1 className="text-4xl">Điểm Danh VIP Hàng Ngày</h1>
				)}
				{(user?.vip ?? 0) > 0 && (
					<TableClaimVip
						setMsg={setMsg}
						showModel={showModel}
					/>
				)}
				{(user?.vip ?? 0) < 1 && <TableReviewClaimVip />}
			</div>

			<dialog
				id="claim-noti"
				className="modal">
				<div className="modal-box">
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
							✕
						</button>
					</form>
					<h3 className="font-bold text-lg">Thông báo người chơi</h3>
					<p className="py-4">{msg}</p>
				</div>
			</dialog>

			<dialog
				id="claim-noti2"
				className="modal">
				<div className="modal-box max-w-2xl w-full">
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
							✕
						</button>
					</form>
					<h3 className="font-bold text-lg">Thông báo người chơi</h3>

					<p className="max-w-xl w-full flex flex-col">
						<span>
							<span className="text-primary">Lưu ý:</span> Số thỏi vàng nhận chỉ
							duy trì <span className="text-primary">30 ngày</span> kể từ ngày
							đầu tiên kích hoạt <span className="text-primary">VIP</span>
						</span>
						<span>
							- Để nhận quà mỗi ngày thì người chơi phải thắng số thỏi vàng trên{' '}
							<span className="text-primary">100</span> đối với các{' '}
							<span className="text-primary">VIP 1,2,3</span> và{' '}
							<span className="text-primary">500</span> đối với các{' '}
							<span className="text-primary">VIP còn lại</span>
						</span>
						<span>
							- Sau <span className="text-primary">7 ngày</span> liên tục không
							tham gia hoạt động <span className="text-primary">VIP</span> sẽ bị{' '}
							<span className="text-primary">mất quyền lợi VIP</span>
						</span>
					</p>
				</div>
			</dialog>
		</div>
	);
}

function TableClaimVip({ setMsg, showModel }: { setMsg: any; showModel: any }) {
	const userVip = useAppSelector((state) => state.userVip);
	const user = useAppSelector((state) => state.user);
	const dispath = useAppDispatch();

	const handleClaim = async (date: any) => {
		try {
			const res = await apiClient.post(
				'/user/vip/claim',
				{
					date: date,
				},
				{
					headers: {
						Authorization: 'Bearer ' + user?.token,
					},
				},
			);
			const result = res.data;
			setMsg(result.message);
			showModel();
			if (result?.status === 200) {
				dispath(updateUser({ ...user, ...result?.data?.user }));
				let new_data = JSON.parse(result?.data?.vip?.data);
				dispath(updateUserVip({ ...result?.data?.vip, data: new_data }));
			}
			return;
		} catch (err) {}
	};
	return (
		<div className="grid grid-cols-7 gap-4 p-4">
			{userVip &&
				userVip?.data?.map((d, i) => {
					return (
						<button
							className="size-36 flex items-end justify-end hover:scale-125 duration-300 hover:z-10 bg-cover border border-current p-2 rounded-lg"
							key={d?.date}
							style={{
								backgroundImage: `url("/image/vip/claim/${
									d?.isClaim ? 'open.png' : 'claim.png'
								}")`,
							}}
							onClick={() => handleClaim(d?.date)}
							disabled={d?.isClaim || d?.isNext}>
							Ngày {i + 1}
						</button>
					);
				})}
		</div>
	);
}

function TableReviewClaimVip() {
	const evenConfig = useAppSelector((state) => state.eventConfig);
	const [vip, setVip] = useState([]);
	const [prize, setPrize] = useState([]);

	useEffect(() => {
		if (evenConfig) {
			const e_value_vip = evenConfig.find((e) => e.name === 'e-value-vip');
			const e_value_vip_claim = evenConfig.find(
				(e) => e.name === 'e-value-vip-claim',
			);
			setVip(JSON.parse(e_value_vip?.option ?? '[]'));
			setPrize(JSON.parse(e_value_vip_claim?.option ?? '[]'));
		}
	}, [evenConfig]);

	return (
		<div className="py-4 flex flex-col gap-2">
			<h1 className="text-xl">
				Mua vàng tích tiền lên{' '}
				<span className="text-error">thành viên VIP</span>
			</h1>
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
						{vip?.map((v: any, i: number) => {
							return (
								<tr key={`${i}-vip`}>
									<td>VIP {i + 1}</td>
									<td>
										{new Intl.NumberFormat('vi', {
											currency: 'VND',
											style: 'currency',
										}).format(v)}
									</td>
									<td>{prize[i]} Thỏi/ngày</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<p className="text-error">Lưu ý:</p>
			<p>- VIP tương ứng với tổng số tiền bạn nạp trong 30 ngày gần nhất!</p>
			<p>- Áp dụng cho nạp thẻ cào và Bank</p>
			<p>
				- Khi lên VIP bạn sẽ trông ngầu hơn khi chém gió và đặc biệt rất dễ tán
				gái nhé
			</p>
		</div>
	);
}
