'use client';
import React from 'react';

export default function TableClans() {
	return (
		<div className="lg:flex lg:flex-col grid gap-1">
			<div className="border-current border rounded-box grid h-20 place-items-center">
				Bang Hội Cái Bang
			</div>
			<div className="overflow-auto border border-current max-h-[600px]">
				<table className="table table-lg table-pin-rows table-pin-cols">
					{/* head */}
					<thead className="text-sm text-center">
						<tr>
							<th>TOP</th>
							<th>Bang Hội</th>
							<th>Thành Viên</th>
							<th>Gold</th>
							<th>Phần Thưởng/Người</th>
						</tr>
					</thead>
					<tbody className="text-sm text-center text-nowrap">
						{/* row 1 */}
						<tr className="hover">
							<td>1</td>
							<td>Bugs Ở Đâu</td>
							<td>249,000,000</td>
							<td>25/25</td>
							<td>1000tr</td>
						</tr>
						{/* row 2 */}
						<tr className="hover">
							<td>2</td>
							<td>Job Dm</td>
							<td>149,000,000</td>
							<td>15/25</td>
							<td>500tr</td>
						</tr>
						{/* row 3 */}
						<tr className="hover">
							<td>3</td>
							<td>Đau Lưng, Mỏi Gối</td>
							<td>109,000,000</td>
							<td>1/25</td>
							<td>100tr</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}