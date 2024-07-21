"use client";
import Draggable from "react-draggable";
import "@/css/BanTx.css";
export default function Bantx() {
  return (
    <Draggable>
      <div className="khungtx absolute bg-blue-50 grid grid-cols-6 grid-rows-12">
        {/* User Bet Do */}
        {/* <div className="col-start-12 row-start-2">Thoat</div>
        <div className="col-start-5 row-start-2">
          <div className="grid grid-rows-2">
            <div className="row-start-2">0</div>
          </div>
        </div>
        <div className="col-start-9 col-span-3 row-start-5 text-center text-red-500 font-medium">
          0
        </div> */}
      </div>
    </Draggable>
  );
}
