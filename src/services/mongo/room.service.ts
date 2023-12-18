import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomType } from '../../types/room.type';
import {Room, RoomDocument} from "../../entities/mongodb/room.schema";

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
  ) {}

  async getRooms(userId: number, roomName?: string): Promise<any> {
    const matchCondition: any = {
      user_ids: { $in: [Number(userId)] },
    };
    if (roomName) {
      matchCondition.name = {
        $regex: new RegExp(roomName, 'i'),
      };
    }
    return this.roomModel.aggregate([
      {
        $match: matchCondition,
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
        $unwind: {
          path: '$messages',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          'messages.createdAt': -1,
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          thumbnail: { $first: '$thumbnail' },
          latest_message: { $first: '$messages.message' },
          latest_message_at: { $first: '$latest_message_at' },
          unread_count: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $isArray: '$messages.unread_user_ids' },
                    {
                      $in: [Number(userId), '$messages.unread_user_ids'],
                    },
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      {
        $sort: {
          latest_message_at: -1,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          thumbnail: 1,
          latest_message: 1,
          latest_message_at: 1,
          unread_count: 1
        },
      },
    ])
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
