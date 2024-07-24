import React from 'react';

export default function TableUser() {
	return (
		<div className="overflow-x-auto">
			<table className="table table-lg table-zebra">
				{/* head */}
				<thead className="bg-error text-sm text-white text-center">
					<tr>
						<th>TOP</th>
						<th>Nhân Vật</th>
						<th>Gold</th>
						<th>Phần Thưởng</th>
					</tr>
				</thead>
				<tbody className="text-sm text-center">
					{/* row 1 */}
					<tr className="hover">
						<th>1</th>
						<td>Bugs Ở Đâu</td>
						<td>249,000,000</td>
						<td>1000tr</td>
					</tr>
					{/* row 2 */}
					<tr className="hover">
						<th>2</th>
						<td>Job Dm</td>
						<td>149,000,000</td>
						<td>500tr</td>
					</tr>
					{/* row 3 */}
					<tr className="hover">
						<th>3</th>
						<td>Đau Lưng, Mỏi Gối</td>
						<td>109,000,000</td>
						<td>100tr</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
