import { Controller, Get, Param, Res } from '@nestjs/common';
import { MessageService } from './services/message.service';
import { Response } from 'express';
import { RoomService } from './services/room.service';

@Controller()
export class AppController {
  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
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
  async getRooms(
    @Param('id') userId: number,
    @Res() res: Response,
  ): Promise<any> {
    const rooms = await this.roomService.getRooms(userId);
    res.status(200).json({
      status: 200,
      message: 'MSG_202',
      data: {
        rooms,
      },
    });
  }
}
