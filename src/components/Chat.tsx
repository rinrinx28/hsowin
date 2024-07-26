import React from 'react';
import Send from './icons/send';
import Chat from './icons/chat';
import Link from 'next/link';
import { useAppSelector } from '@/lib/redux/hook';

export default function ChatBox() {
	const user = useAppSelector((state) => state.user);

	const handlerBetUser = () => {
		if (!user.isLogin) {
			const modal = document.getElementById(
				'my_modal_1',
			) as HTMLDialogElement | null;
			if (modal) {
				modal.showModal();
			}
			return;
		}
	};
	return (
		<div className="lg:col-start-2 lg:row-start-1 row-span-5 bg-base-100 flex flex-col gap-2 border border-current shadow-xl p-4 rounded-2xl">
			<div className="flex flex-col gap-2 w-full border-b border-current">
				<div className="flex flex-row items-center justify-center gap-2">
					<Chat />
					<h2 className="text-center font-semibold text-2xl">Trò Chuyện</h2>
				</div>
			</div>
			<div className="overflow-auto max-h-[900px] bg-base-200 h-full rounded-lg p-4">
				<div className="chat chat-start">
					<div className="chat-header">Hệ thống</div>
					<div className="chat-bubble chat-bubble-primary">
						BOSS Tiểu đội trưởng vừa xuất hiện tại Núi khỉ đen - Server: 3
					</div>
				</div>
				<div className="chat chat-start">
					<div className="chat-header">Obi-Wan Kenobi</div>
					<div className="chat-bubble chat-bubble-primary">I loved you.</div>
				</div>
				<div className="chat chat-end">
					<div className="chat-header">Obi-Wan Kenobi</div>
					<div className="chat-bubble chat-bubble-info">I loved you.</div>
				</div>
				<div className="chat chat-start">
					<div className="chat-header">Hệ thống</div>
					<div className="chat-bubble chat-bubble-primary">
						BOSS Tiểu đội trưởng vừa xuất hiện tại Núi khỉ đen - Server: 3
					</div>
				</div>
				<div className="chat chat-start">
					<div className="chat-header">Obi-Wan Kenobi</div>
					<div className="chat-bubble chat-bubble-primary">I loved you.</div>
				</div>
				<div className="chat chat-end">
					<div className="chat-header">Obi-Wan Kenobi</div>
					<div className="chat-bubble chat-bubble-info">I loved you.</div>
				</div>
				<div className="chat chat-start">
					<div className="chat-header">Hệ thống</div>
					<div className="chat-bubble chat-bubble-primary">
						BOSS Tiểu đội trưởng vừa xuất hiện tại Núi khỉ đen - Server: 3
					</div>
				</div>
				<div className="chat chat-start">
					<div className="chat-header">Obi-Wan Kenobi</div>
					<div className="chat-bubble chat-bubble-primary">I loved you.</div>
				</div>
				<div className="chat chat-end">
					<div className="chat-header">Obi-Wan Kenobi</div>
					<div className="chat-bubble chat-bubble-info">I loved you.</div>
				</div>
				<div className="chat chat-start">
					<div className="chat-header">Hệ thống</div>
					<div className="chat-bubble chat-bubble-primary">
						BOSS Tiểu đội trưởng vừa xuất hiện tại Núi khỉ đen - Server: 3
					</div>
				</div>
				<div className="chat chat-start">
					<div className="chat-header">Obi-Wan Kenobi</div>
					<div className="chat-bubble chat-bubble-primary">I loved you.</div>
				</div>
				<div className="chat chat-end">
					<div className="chat-header">Obi-Wan Kenobi</div>
					<div className="chat-bubble chat-bubble-info">I loved you.</div>
				</div>
				<div className="chat chat-start">
					<div className="chat-header">Hệ thống</div>
					<div className="chat-bubble chat-bubble-primary">
						BOSS Tiểu đội trưởng vừa xuất hiện tại Núi khỉ đen - Server: 3
					</div>
				</div>
				<div className="chat chat-start">
					<div className="chat-header">Obi-Wan Kenobi</div>
					<div className="chat-bubble chat-bubble-primary">I loved you.</div>
				</div>
				<div className="chat chat-end">
					<div className="chat-header">Obi-Wan Kenobi</div>
					<div className="chat-bubble chat-bubble-info">I loved you.</div>
				</div>
				<div className="chat chat-start">
					<div className="chat-header">Hệ thống</div>
					<div className="chat-bubble chat-bubble-primary">
						BOSS Tiểu đội trưởng vừa xuất hiện tại Núi khỉ đen - Server: 3
					</div>
				</div>
				<div className="chat chat-start">
					<div className="chat-header">Obi-Wan Kenobi</div>
					<div className="chat-bubble chat-bubble-primary">I loved you.</div>
				</div>
				<div className="chat chat-end">
					<div className="chat-header">Obi-Wan Kenobi</div>
					<div className="chat-bubble chat-bubble-info">I loved you.</div>
				</div>
			</div>
			<div className="flex flex-row w-full py-2 gap-2">
				<input
					type="text"
					className="grow w-full input input-bordered"
					placeholder="Nhập nội dung trò chuyện"
				/>
				<button
					onClick={handlerBetUser}
					className="btn  btn-outline">
					<Send />
				</button>
			</div>
			<dialog
				id="my_modal_1"
				className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Thông Báo Người Chơi</h3>
					<p className="py-4">
						Có vẻ bạn chưa đăng nhập, xin vui lòng{' '}
						<Link
							href={'/login'}
							className="link link-hover link-primary">
							đăng nhập
						</Link>{' '}
						để tiếp tục!
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
