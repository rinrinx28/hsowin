import React from 'react';

export default function TableResult() {
	return (
		<div className="overflow-x-auto">
			<table className="table table-lg table-zebra">
				{/* head */}
				<thead className="bg-info text-sm text-white text-center">
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
						<th>1</th>
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
						<th>1</th>
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
						<th>1</th>
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
	);
}
