import { Controller, Get, Param, Res, Query } from '@nestjs/common';
import { MessageService } from './services/mongo/message.service';
import { Response } from 'express';
import { RoomService } from './services/mongo/room.service';
import {UserService} from "./services/mysql/user.service";

@Controller()
export class AppController {
  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
    private readonly userService: UserService,
  ) {}

  @Get('users/:id/unread-messages')
  async getUnreadMessage(
    @Param('id') userId: number,
    @Res() res: Response,
  ): Promise<any> {
    const count = (await this.messageService.getUnreadMessages(userId)).length;
    res.status(200).json({
      status: 200,
      message: 'MSG_202',
      data: {
        count,
      },
    });
  }

  @Get('users/:id/rooms')
  async getRooms(@Param('id') userId: number, @Query('name') roomName: string, @Res() res: Response): Promise<any> {
    const rooms = await this.roomService.getRooms(userId, roomName)
    res.status(200).json({
      status: 200,
      message: 'MSG_202',
      data: {
        rooms,
      },
    });
  }

  @Get('users')
  async getUsers(@Res() res: Response) {
    const users = await this.userService.findAll()
    res.status(200).json({
      status: 200,
      message: 'MSG_202',
      data: {
        users,
      },
    });
  }
}
