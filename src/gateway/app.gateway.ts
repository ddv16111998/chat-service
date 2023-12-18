import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from '../services/mongo/room.service';
import { MessageService } from '../services/mongo/message.service';
import {
  OpenRoomRequest,
  OpenRoomResponse,
  RoomType,
} from '../types/room.type';
import { MessageType } from '../types/message.type';
import {Room} from "../entities/mongodb/room.schema";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly roomService: RoomService,
    private readonly messageService: MessageService,
  ) {}

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: MessageType): Promise<void> {
    const room = await this.roomService.getRoomById(payload.room_uuid);
    const request = await this.messageService.getPayloadCreate(payload, room);
    const message = await this.messageService.createMessage(request);
    this.roomService.updateRoom(room._id.toString(), {
      latest_message_at: new Date(),
    });
    const res = await this.messageService.getResponseMessage(message);
    client.join(res.room_uuid);
    this.server.to(payload.room_uuid.toString()).emit('message', res);
  }

  @SubscribeMessage('openChat')
  async handleOpenChat(
    client: Socket,
    payload: OpenRoomRequest,
  ): Promise<void> {
    let room: Room = await this.roomService.getRoomByUserIds(payload.user_ids);
    let histories = [];
    if (!room) {
      const data = await this.getRequestCreateRoom(payload);
      room = await this.roomService.createRoom(data);
    } else {
      histories = await this.messageService.getMessageByRoom(
        room._id.toString(),
      );
    }

    const roomId = room._id.toString();
    const response: OpenRoomResponse = {
      room_id: roomId,
      histories: histories,
    };
    client.join(roomId);
    this.server.to(roomId).emit('openChat', response);
  }

  async getRequestCreateRoom(payload: OpenRoomRequest) {
    const request: RoomType = {
      name: payload.name,
      thumbnail: '',
      created_by: payload.created_by,
      user_ids: payload.user_ids,
      latest_message_at: null,
    };
    return request;
  }

  afterInit(server: any): any {
    console.log('init server', server);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
