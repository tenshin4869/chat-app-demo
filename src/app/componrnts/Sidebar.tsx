"use client";
import {
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { TbLogout2 } from "react-icons/tb";
import { auth, db } from "../../../firebase";
import { useAppContext } from "@/context/AppContext";

type Room = {
  id: string;
  name: string;
  createdAt: Timestamp;
};

export default function Sidebar() {
  const { user, userId, setSelectedRoom, setSelectRoomName } = useAppContext();
  console.log(userId);

  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (user) {
      const fetchRooms = async () => {
        const roomCollectionRef = collection(db, "rooms"); //コレクション取得
        const q = query(
          roomCollectionRef,
          where("userId", "==", userId), //where条件を決めることができる。userIdが同じのとき
          orderBy("createdAt")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newRooms: Room[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            //...doc.data(),スプレット構文の書き方
            name: doc.data().name,
            createdAt: doc.data().createdAt,
          }));
          setRooms(newRooms);
        });
        return () => {
          unsubscribe();
        };
      };

      fetchRooms();
    }
  }, [userId]);

  const selectRoom = (roomId: string, roomName: string) => {
    setSelectedRoom(roomId);
    setSelectRoomName(roomName);
  };

  const addNewRoom = async () => {
    const roomName = prompt("ルーム名を入力してください。");
    if (roomName) {
      const newRoomRef = collection(db, "rooms");
      await addDoc(newRoomRef, {
        name: roomName,
        userId: userId,
        createdAt: serverTimestamp(),
      });
    }
  };

  const handelLogout = () => {
    auth.signOut();
  };

  return (
    <div className="bg-custom-blue  h-full overflow-y-auto px-5 flex flex-col">
      <div className="flex-grow">
        <div
          onClick={addNewRoom}
          className="cursor-pointer flex justify-evenly items-center border mt-2 rounded-md hover:bg-blue-800 duration-150"
        >
          <span className="text-white p-4 text-2xl">＋</span>
          <h1 className="text-white texd-xl font-semibold p-4 ">New Chat</h1>
        </div>
        <ul>
          {rooms.map((room) => (
            <li
              key={room.id}
              className="cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-700 duration-150"
              onClick={() => selectRoom(room.id, room.name)}
            >
              {room.name}
            </li>
          ))}

          {/* <li className="cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-700 duration-150">
            Room 2
          </li>
          <li className="cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-700 duration-150">
            Room 3
          </li>
          <li className="cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-700 duration-150">
            Room 4
          </li> */}
        </ul>
      </div>
      {user && (
        <div className="mb-2 p-4 text-slate-100 text-lg font-medium">
          {user.email}
        </div>
      )}
      <div
        onClick={() => handelLogout()}
        className="flex items-center mb-2 justify-evenly cursor-pointer p-4 text-slate-100 hover:bg-slate-700 duration-150"
      >
        <TbLogout2 />
        <span>ログアウト</span>
      </div>
    </div>
  );
}
