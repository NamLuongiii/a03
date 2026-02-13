import {create} from "zustand";
import type {Room, User} from "../types";
import {WSRequest} from "../services";

export type Message = {
    message: string,
    user: User,
    roomId: number,
    showSender: boolean,
}

export type ChatUser = User & {
    emotion?: WSRequest
    hand?: boolean
}

interface RoomState {
    room: Room | null
    setRoom: (room: Room) => void
    connectionReady: boolean
    setConnectionReady: (ready: boolean) => void
    messages: Message[]
    push: (message: Message) => void
    users: Record<number, ChatUser>
    setUsers: (users: ChatUser[]) => void
    pushUser: (user: ChatUser) => void
    clear: () => void
    removeUser: (userId: number) => void
    updateEmotion: (userId: number, emotion: WSRequest) => void
    updateHand: (userId: number) => void
}
const defaultValue: { room: null; connectionReady: boolean; messages: Message[]; users: Record<number, ChatUser> } = {
    room: null,
    connectionReady: false,
    messages: [],
    users: {},
}

const useChatRoom = create<RoomState>((set) => ({
...defaultValue,
  setRoom: (room: Room) => set({room}),
  setConnectionReady: (ready: boolean) => set({connectionReady: ready}),
    push: (message: Message) => {
      set(state => {
          const lastMessage = state.messages[0]
          if (!lastMessage) {
              message.showSender = true
          } else {
              message.showSender = lastMessage.user.id !== message.user.id
          }
          return ({messages: [message, ...state.messages]})
      })
    },
    setUsers: (users: ChatUser[]) => set(state => {
        const _users: Record<number, ChatUser> = {}
        users.forEach(user => {
            _users[user.id] = user
        })
        state.users = _users
        return state.users
    }),
    pushUser: (user: ChatUser) => set(state => ({users: { ...state.users, [user.id]: user}})),
    removeUser: (userId: number) => {
        return  set(state => {
            delete state.users[userId]
            return {
                users: {...state.users}
            }
        })
    },
    clear: () => set(defaultValue),
    updateEmotion: (userId: number, emotion: WSRequest) => set(state => {
        const u = state.users[userId]
        if (u) {
            if (u.emotion === emotion) {
                u.emotion = undefined;
            } else {
                u.emotion = emotion
            }
        }
        return {...state}
    }),
    updateHand: (userId: number) => set(state => {
        const u = state.users[userId]
        if (u) {
            u.hand = !u.hand
        }
        return {...state }
    })
}));

export default useChatRoom;
