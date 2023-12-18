import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageType } from '../../types/message.type';
import {Message, MessageDocument} from "../../entities/mongodb/message.schema";
import {Room} from "../../entities/mongodb/room.schema";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}
  async getMessageByRoom(roomUuid: string): Promise<Message[]> | null {
    return this.messageModel.find({ room_uuid: roomUuid }).exec();
  }

  async getPayloadCreate(
    payload: MessageType,
    room: Room,
  ): Promise<MessageType> {
    const roomUserIds = room.user_ids;
    payload.unread_user_ids = roomUserIds.filter(
      (item) => item !== payload.created_by,
    );

    return payload;
  }

  async createMessage(payload: MessageType): Promise<Message> {
    try {
      return this.messageModel.create(payload);
    } catch (err) {
      throw err;
    }
  }

  async getResponseMessage(message: Message): Promise<MessageType> {
    const res: any = message;
    res._id = message._id.toString();
    res.room_uuid = message.room_uuid.toString();
    return res;
  }

  async getUnreadMessages(userId: number): Promise<Message[]> {
    return this.messageModel.find({ unread_user_ids: { $in: userId } }).exec();
  }
}
