import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from './styles.module.css'

const SideBar = ({ onCreateRoom, setRooms, rooms }) => {
    const [newRoomName, setNewRoomName] = useState('');

    const handleCreateRoom = () => {
        onCreateRoom(newRoomName);
        setRooms((rooms) => [...rooms], {name: newRoomName})
        setNewRoomName(''); // Очищаем поле ввода после создания комнаты
    };

    return (

        <div className={styles.sidebar}>
            <h4 className={styles.header}>Rooms</h4>
            <ul className={styles.users}>
            {rooms.map((room, index) => (
                    <li className={styles.user} key={index}><Link to={`/chat/${room.name}`}>{room.name}</Link></li>
                ))}
            </ul>
            <div className={styles.container}>
            <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Enter room name"
            />
            <button className={styles.btn} onClick={handleCreateRoom}>Create Room</button>
            </div> 
        </div>
    );
};

export default SideBar;