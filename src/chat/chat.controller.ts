import { Controller, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('/api/chat')
export class ChatController {
  constructor(private readonly appService: ChatService) {}

  @Get()
  async generateResponse(@Query() query): Promise<any> {
    return await this.appService.generateResponse(query.question);
  }
}
