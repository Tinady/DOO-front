import { createLazyFileRoute } from '@tanstack/react-router';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import SideBar2 from '../components/SideBar2';
import UserName from '../components/UserName';
import avatar from '../../public/asset/icons/avatar.svg';

export const Route = createLazyFileRoute('/notification')({
  component: () => {
    const [notifications, setNotifications] = useState([]);
    
    useEffect(() => {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        const userId = userData._id;

        const fetchNotifications = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/initiate/notifications/${userId}`);
            setNotifications(response.data);
          } catch (error) {
            console.error('Error fetching notifications:', error);
          }
        };

        fetchNotifications();
      }
    }, []);

    return (
      <div>
        <UserName />
        <SideBar2 />
        <div className="mt-36 ml-80 mr-8 w-full h-full">
          <h1 className="text-teal-400 text-2xl">Notifications</h1>
          <div className="shadow-lg w-7/12 flex flex-col gap-4 px-12 py-6 border border-opacity-15 mt-6">
            {notifications.length === 0 ? (
              <div className="text-center text-sm text-gray-700">No notifications</div>
            ) : (
              notifications.map((notification, index) => (
                <div key={index} className="flex gap-2 items-center p-2 border-b border-opacity-20">
                  <img src={avatar} className="h-8" alt="User avatar" />
                  <div>
                    <p className="text-sm text-gray-400">
                      <a href="#" className="text-teal-400">{notification.workflowName}</a> was assigned to you
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  },
});
