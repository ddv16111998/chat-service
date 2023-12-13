export type MessageType = {
  _id?: string;
  room_uuid: string;
  message: string;
  type: number;
  created_by: number;
  unread_user_ids: number[];
};
