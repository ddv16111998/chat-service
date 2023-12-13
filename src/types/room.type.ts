export type RoomType = {
  name?: string;
  thumbnail?: string;
  created_by?: number;
  user_ids?: number[];
  latest_message_at?: Date;
};

export type OpenRoomRequest = {
  user_ids: number[];
  created_by?: number;
};

export type ChatHistoryType = {
  user_id: number;
  message: string;
};

export type OpenRoomResponse = {
  room_id: string;
  histories: ChatHistoryType[];
};
