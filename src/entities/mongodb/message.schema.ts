import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Room } from './room.schema';
import mongoose, { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }] })
  room_uuid: Room;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: Number, required: true })
  type: number;

  @Prop({ type: Number, required: true })
  created_by: number;

  @Prop({ type: [Number], default: [] })
  unread_user_ids: number[];

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.Date, default: null })
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
