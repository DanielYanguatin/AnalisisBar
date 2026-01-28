import React from "react";
import {
  RiHome6Line,
  RiPercentLine,
  RiPieChartLine,
  RiMailLine,
  RiNotification3Line,
  RiSettings4Line,
  RiLogoutCircleRLine,
} from "react-icons/ri";

const Sidebar = (props) => {
  const { showMenu } = props;

  return (
    <div
      className={`bg-blue-500 fixed lg:left-2 top-2 w-18 h-full flex flex-col justify-between py-4 rounded-tr-lg rounded-br-lg z-40 transition-all duration-300 ${
        showMenu ? "left-0" : "-left-full"
      }`}
    >
      <div>
        <ul className="pl-4">
          <li>
          {/*   <h1 className="text-center my-2"  >
              <img
                 src="./1-logo-alcohol.jpg" alt="Logo" className="mx-auto h-20"
              />
            </h1> */}
          </li>
          <li className="bg-[#262837] p-4 rounded-tl-xl rounded-bl-xl">
            <a
              href="#"
              className="bg-[#ffffff] p-4 flex justify-center rounded-xl "
            >
              <RiHome6Line className="text-1xl" />
            </a>
          </li>
          <li className="hover:bg-[#262837] p-4 rounded-tl-xl rounded-bl-xl group transition-colors">
            <a
              href="#"
              className="text-white p-4 flex justify-center rounded-xl  group-hover:text-white transition-colors"
            >
              <RiPercentLine className="text-1xl" />
            </a>
          </li>
          <li className="hover:bg-[#262837] p-4 rounded-tl-xl rounded-bl-xl group transition-colors">
            <a
              href="#"
              className="text-white p-4 flex justify-center rounded-xl  group-hover:text-white transition-colors"
            >
              <RiPieChartLine className="text-1xl" />
            </a>
          </li>
          <li className="hover:bg-[#262837] p-4 rounded-tl-xl rounded-bl-xl group transition-colors">
            <a
              href="#"
              className="text-white p-4 flex justify-center rounded-xl  group-hover:text-white transition-colors"
            >
              <RiMailLine className="text-1xl" />
            </a>
          </li>
          <li className="hover:bg-[#262837] p-4 rounded-tl-xl rounded-bl-xl group transition-colors">
            <a
              href="#"
              className="text-white p-4 flex justify-center rounded-xl  group-hover:text-white transition-colors"
            >
              <RiNotification3Line className="text-1xl" />
            </a>
          </li>
          <li className="hover:bg-[#262837] p-4 rounded-tl-xl rounded-bl-xl group transition-colors">
            <a
              href="#"
              className="text-white p-4 flex justify-center rounded-xl  group-hover:text-white transition-colors"
            >
              <RiSettings4Line className="text-1xl" />
            </a>
          </li>
        </ul>
      </div>
      <div>
        <ul className="pl-4">
          <li className="hover:bg-[#262837] p-4 rounded-tl-xl rounded-bl-xl group transition-colors">
            <a
              href="#"
              className="text-white p-4 flex justify-center rounded-xl bg-blue-500 group-hover:text-white transition-colors"
            >
              <RiLogoutCircleRLine className="text-1xl" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
