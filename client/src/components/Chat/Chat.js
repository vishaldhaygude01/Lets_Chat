import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import './Chat.css';
import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'
import TextContainer from "../TextContainer/TextContainer";

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'localhost:5000';
    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        socket = io(ENDPOINT, { transports: ['websocket', 'polling', 'flashsocket'] });
        setRoom(room);
        setName(name)

        socket.emit('join', { name, room }, ({ error }) => {

        });


        return () => {
            socket.emit('disconnect');

            socket.off();
        }
    }, [ENDPOINT, location.search]);


    useEffect(() => {
        socket.on('message', message => {
            setMessages(messages => [...messages, message]);
        });


    }, [messages]);


    const sendMessage = (event) => {
        event.preventDefault();

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }
    console.log(message, messages);


    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={sendMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={users} setUsers={setUsers} />
        </div>
    )

}

export default Chat;