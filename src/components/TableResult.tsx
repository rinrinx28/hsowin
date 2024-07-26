'use client';
import React from 'react';

export default function TableResult() {
	return (
		<div className="lg:flex lg:flex-col grid gap-1">
			<div className="border-current border rounded-box grid h-20 place-items-center">
				Lịch Sử Kết Quả
			</div>
			<div className="overflow-x-auto border border-current">
				<table className="table table-lg table-pin-rows table-pin-cols">
					{/* head */}
					<thead className="text-sm  text-center">
						<tr>
							<th>Server</th>
							<th>Nhân Vật</th>
							<th>Gold Cược</th>
							<th>Loại</th>
							<th>Dự Đoán</th>
							<th>Kết Quả</th>
							<th>Gold Nhận</th>
							<th>Tình Trạng</th>
							<th>Thời gian</th>
							<th>Thao Tác</th>
						</tr>
					</thead>
					<tbody className="text-sm text-center text-nowrap">
						{/* row 1 */}
						<tr className="hover">
							<td>1</td>
							<td>Cy Ganderton</td>
							<td>249,000,000</td>
							<td>Tài xỉu</td>
							<td>Xỉu</td>
							<td>33</td>
							<td>473,100,000</td>
							<td>ĐÃ THANH TOÁN</td>
							<td>Ngáo Ngơ</td>
							<td></td>
						</tr>
						{/* row 2 */}
						<tr className="hover">
							<td>1</td>
							<td>Cy Ganderton</td>
							<td>249,000,000</td>
							<td>Tài xỉu</td>
							<td>Xỉu</td>
							<td>33</td>
							<td>473,100,000</td>
							<td>ĐÃ THANH TOÁN</td>
							<td>Ngáo Ngơ</td>
							<td></td>
						</tr>
						{/* row 3 */}
						<tr className="hover">
							<td>1</td>
							<td>Cy Ganderton</td>
							<td>249,000,000</td>
							<td>Tài xỉu</td>
							<td>Xỉu</td>
							<td>33</td>
							<td>473,100,000</td>
							<td>ĐÃ THANH TOÁN</td>
							<td>Ngáo Ngơ</td>
							<td></td>
						</tr>
					</tbody>
				</table>
			</div>

			<div className="flex flex-row justify-between w-full">
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
						className="select select-bordered w-full">
						<option value={'10'}>10</option>
						<option value={'25'}>25</option>
						<option value={'50'}>50</option>
					</select>
				</div>
			</div>
		</div>
	);
}
