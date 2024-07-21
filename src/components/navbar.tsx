function Navbar() {
  return (
    // <div className="grid grid-cols-[12] justify-center w-full sticky">
    //   <div className="col-span-3 items-center">
    //     <Image
    //       src={"/images/logo_hsowin_done.gif"}
    //       alt="logo_hsowin_done"
    //       width={200}
    //       height={24}
    //     />
    //   </div>
    // </div>
    <div className="col-start-3 col-span-8">
      <div className="grid grid-cols-12">
        <div className="bg-blue-500 p-4">Column 1</div>
        <div className="bg-green-500 p-4">Column 2</div>
        <div className="bg-red-500 p-4">Column 3</div>
        <div className="bg-yellow-500 p-4">Column 4</div>
        {/* Repeat as necessary to demonstrate the 12-column layout */}
        <div className=" bg-purple-500 p-4">Column 5</div>
        <div className=" bg-pink-500 p-4">Column 6</div>
        <div className="bg-blue-500 p-4">Column 1</div>
        <div className="bg-green-500 p-4">Column 2</div>
        <div className="bg-red-500 p-4">Column 3</div>
        <div className="bg-yellow-500 p-4">Column 4</div>
        <div className=" bg-purple-500 p-4">Column 5</div>
        <div className=" bg-pink-500 p-4">Column 6</div>
      </div>
    </div>
  );
}

export default Navbar;
