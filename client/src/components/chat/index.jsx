import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './styles.module.css'
import SideBarUsers from './components/sidebar-users/sidebar.jsx'
import Body from './components/body/body.jsx'
import MessageBlock from './components/message-block/message-block.jsx'
import SideBarRooms from './components/sidebar-rooms/sidebar.jsx'

const ChatPage = ({socket}) => {
    const { roomName } = useParams();
    const [messages, setMessages] = useState([])
    const [status, setStatus] = useState('')
    const [rooms, setRooms] = useState([]);

    const handleCreateRoom = (newRoomName) => {
      // Emit 'createRoom' event to the server
      socket.emit('createRoom', newRoomName);
  };

  useEffect(() => {
    // Listen for new rooms created by other users
    socket.on('roomCreated', (newRoom) => {
        setRooms((prevRooms) => [...prevRooms, newRoom]);
    });

    return () => {
        socket.off('roomCreated');
    };
}, [socket]);

useEffect(() => {
    if (roomName) {
        setMessages([]);
        // Join the room when the component mounts
        socket.emit('joinRoom', roomName);

        socket.on('response', (data) => setMessages((prevMessages) => [...prevMessages, data]));
    }

    return () => {
        if (roomName) {
            socket.emit('leaveRoom', roomName);
            socket.off('response');
        }
    };
}, [socket, roomName]);

    useEffect(() => {
        socket.on('response', (data) => setMessages([...messages, data]))
    }, [socket, messages])

    useEffect(() => {
        socket.on('responseTyping', (data) => {
        setStatus(data)
        setTimeout(() => setStatus(''), 1000)
        })
    }, [socket])

    return (
        <div className={styles.chat}>
        <SideBarRooms onCreateRoom={handleCreateRoom} setRooms={setRooms} rooms={rooms}/>
        <main className={styles.main}>
          <Body messages={messages} status={status} />
          <MessageBlock socket={socket}/> 
        </main>
        <SideBarUsers socket={socket} />
      </div>
    );
};

export default ChatPage;