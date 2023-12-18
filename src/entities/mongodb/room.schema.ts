import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false })
  thumbnail: string;

  @Prop({ type: Number, required: true })
  created_by: number;

  @Prop({ type: [Number], default: [] })
  user_ids: number[];

  @Prop({ type: Date, default: null })
  latest_message_at: Date;

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.Date, default: null })
  updatedAt: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
