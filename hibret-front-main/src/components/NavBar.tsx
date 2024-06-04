// const NavBar = () => {
//   const user: any = localStorage.getItem("user");
//   const userData = JSON.parse(user);
//   return (
//     <div className="search-bar flex justify-between mt-11 p-3">
//       <div className="flex border border-[#667085] px-3 py-2 rounded-lg ">
//         <input type="text" placeholder="Search something...." />
//         <img src="/asset/icons/search.svg" />
//       </div>

//       <div className="flex gap-6 items-center">
//         <img src="/asset/icons/notification.svg" className=" max-w-6 " />
//         <hr className=" border border-[#EFEFF4] h-11" />
//         <div className="flex gap-4 w-56 items-center ">
//           <div className="w-10 h-10 rounded-full border bg-slate-400 text-white flex justify-center items-center">
//             {userData.username.charAt(0)}
//           </div>
//           {/* <img src="/asset/icons/avatar.svg" /> */}
//           <div className="flex gap-2">
//             <p className="">{userData.username}</p>
//             <img src="/asset/icons/arrowDown.svg" className=" max-w-4" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NavBar;

import React, { useState } from "react";
import upArrow from "../../public/asset/icons/upload-icon.svg";
import downArrow from "/asset/icons/downArrow.svg";
import notifcation from "/asset/icons/notification.svg";
import avatar from "/asset/icons/avatar.svg";
import axios from "axios";

const UserName: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotification, setIsNotification] = useState(false);

  const user: any = localStorage.getItem("user");
  const userData = JSON.parse(user);

  function toggle() {
    setIsOpen((prev) => !prev);
  }

  const handleLogout = async () => {
    try {
      // Send a POST request to the logout endpoint with credentials
      const response = await axios.post(
        "http://localhost:5000/api/logout",
        {},
        { withCredentials: true }
      );

      if (response.data.message === "Logout successful") {
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        console.error("Logout failed:", response.data.error);
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <div className="search-bar flex justify-between mt-11 p-3">
      <div className="flex px-3 py-2 rounded-lg w-72 h-8 justify-between"></div>

      <div className="flex gap-6 items-center">
        <div className="relative">
          <img
            src={notifcation}
            onClick={() => setIsNotification((prev) => !prev)}
            className="max-w-6"
            alt="Notification Icon"
          />
          <div className="h-4 w-4 rounded-full bg-teal-400 text-white text-xs flex items-center justify-center absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
            2
          </div>

          {isNotification ? (
            <div className="max-h-72 w-80 shadow-lg absolute bg-white right-2 flex flex-col gap-4 p-4 border border-opacity-15">
              <div className="flex gap-2 items-center p-2 border-b border-opacity-20">
                <img src={avatar} className="h-8" />
                <div>
                  <p className="text-sm text-gray-400">
                    {" "}
                    <a className="text-teal-400">Workflow Name</a> was assigned
                    to you
                  </p>
                </div>
              </div>

              <div className="flex gap-2 items-center p-2 border-b border-opacity-20">
                <img src={avatar} className="h-8" />
                <div>
                  <p className="text-sm text-gray-400">
                    {" "}
                    <a className="text-teal-400">Workflow Name</a> was assigned
                    to you
                  </p>
                </div>
              </div>

              <a href="/notification">
                <button className="border-npne h-8 text-teal-400 text-sm px-5">
                  View all notification
                </button>
              </a>
            </div>
          ) : (
            <div> </div>
          )}
        </div>

        <hr className="border border-[#EFEFF4] h-11" />
        <div className="flex gap-4 w-56 items-center">
          <div className="w-10 h-10 rounded-full border bg-slate-400 text-white flex justify-center items-center">
            {userData.username.charAt(0)}
          </div>
          <div onClick={toggle} className="flex relative gap-2 cursor-pointer">
            <p className="">{userData.username}</p>
            <img
              src={isOpen ? upArrow : downArrow}
              className="max-w-4"
              alt="Dropdown Arrow"
            />
          </div>
          {isOpen ? (
            <div className="flex flex-col justify-center items-center gap-2 absolute top-14 right-2 h-auto w-44 py-4 border bg-white rounded-md shadow-lg">
              <a href="/changePassword" className="w-full flex justify-center">
                <button className="border text-xs border-gray-300 w-32 py-1 text-gray-500 hover:bg-gray-100 rounded-md">
                  Change Password
                </button>
              </a>
              <button
                className="border w-32 py-1 text-xs text-white bg-red-500 hover:bg-red-600 rounded-md"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          ) : (
            <div> </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserName;
