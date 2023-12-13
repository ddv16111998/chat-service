import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './schemas/message.schema';
import { AppGateway } from './gateway/app.gateway';
import { RoomSchema } from './schemas/room.schema';
import { MessageService } from './services/message.service';
import { RoomService } from './services/room.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/chats'),
    MongooseModule.forFeature([
      { name: 'Message', schema: MessageSchema },
      { name: 'Room', schema: RoomSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, MessageService, RoomService, AppGateway],
})
export class AppModule {}
