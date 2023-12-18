import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './gateway/app.gateway';
import { MessageService } from './services/mongo/message.service';
import { RoomService } from './services/mongo/room.service';
import {MongodbModule} from "./database_connections/mongodb.module";
import {MysqlModule} from "./database_connections/mysql.module";
import {MongooseModule} from "@nestjs/mongoose";
import {MessageSchema} from "./entities/mongodb/message.schema";
import {RoomSchema} from "./entities/mongodb/room.schema";
import {UserService} from "./services/mysql/user.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/mysql/user.entity";

@Module({
  imports: [
    MongodbModule,
    MongooseModule.forFeature([
      { name: 'Message', schema: MessageSchema },
      { name: 'Room', schema: RoomSchema },
    ]),
    MysqlModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [AppService, MessageService, RoomService, AppGateway, UserService],
})
export class AppModule {}
