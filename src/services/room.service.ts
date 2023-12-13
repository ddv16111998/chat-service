import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from '../schemas/room.schema';
import { Model } from 'mongoose';
import { RoomType } from '../types/room.type';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
  ) {}

  async getRooms(userId: number): Promise<any> {
    return this.roomModel.aggregate([
      {
        $match: {
          user_ids: { $in: [Number(userId)] },
        },
      },
      {
        $lookup: {
          from: 'messages',
          localField: '_id',
          foreignField: 'room_uuid',
          as: 'messages',
        },
      },
      {
        $unwind: '$messages',
      },
      {
        $sort: {
          'messages.created_at': -1,
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          thumbnail: { $first: '$thumbnail' },
          created_by: { $first: '$created_by' },
          user_ids: { $first: '$user_ids' },
          latest_message_at: { $first: '$latest_message_at' },
          latest_message: { $last: '$messages.message' },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          thumbnail: 1,
          created_by: 1,
          user_ids: 1,
          latest_message_at: 1,
          'latest_message._id': 1,
          'latest_message.room_uuid': 1,
          'latest_message.message': 1,
          'latest_message.type': 1,
          'latest_message.created_by': 1,
          'latest_message.unread_user_ids': 1,
          __v: 1,
        },
      },
    ]);
  }

  async getDataCreate(data: RoomType): Promise<RoomType> {
    return {
      name: data.name,
      thumbnail: data.thumbnail,
      created_by: data.created_by,
      user_ids: data.user_ids,
      latest_message_at: null,
    };
  }
  async createRoom(data: RoomType): Promise<Room> {
    try {
      const payload = await this.getDataCreate(data);
      return this.roomModel.create(payload);
    } catch (err) {
      throw err;
    }
  }

  updateRoom(id: string, data: RoomType) {
    try {
      this.roomModel.updateOne({ _id: id }, { $set: data }).then((res) => {
        console.info(res, 'res');
      });
    } catch (err) {
      throw err;
    }
  }

  async getRoomByUserIds(userIds: number[]): Promise<Room> | null {
    return this.roomModel
      .findOne({ user_ids: { $size: userIds.length, $all: userIds } })
      .exec();
  }

  async getRoomById(id: string): Promise<Room> {
    return this.roomModel.findOne({ _id: id }).exec();
  }
}
