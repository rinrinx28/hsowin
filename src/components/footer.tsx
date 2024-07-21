import { FooterDto } from "@/dto/footer";
function Footer() {
  return (
    // <div className="flex justify-center items-center w-full">
    //   <div className="grid grid-cols-12">
    //     <div className="bg-blue-500 p-4">Column 1</div>
    //     <div className="bg-green-500 p-4">Column 2</div>
    //     <div className="bg-red-500 p-4">Column 3</div>
    //     <div className="bg-yellow-500 p-4">Column 4</div>
    //     <div className=" bg-purple-500 p-4">Column 5</div>
    //     <div className=" bg-pink-500 p-4">Column 6</div>
    //     <div className="bg-blue-500 p-4">Column 7</div>
    //     <div className="bg-green-500 p-4">Column 8</div>
    //     <div className="bg-red-500 p-4">Column 9</div>
    //     <div className="bg-yellow-500 p-4">Column 10</div>
    //     <div className=" bg-purple-500 p-4">Column 11</div>
    //     <div className=" bg-pink-500 p-4">Column 12</div>
    //   </div>
    // </div>
    <div className="flex flex-col">
      <div>About</div>
      <div className="flex w-full justify-center text-center items-center">
        <p className="text-[12px] font-medium">
          Copyright {new Date().getFullYear()} © HSOWIN.CLUB | Prower By Dev
        </p>
      </div>
    </div>
  );
}

export default Footer;
