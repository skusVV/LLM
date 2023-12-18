import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('/api/chat')
export class ChatController {
  constructor(private readonly appService: ChatService) {}

  @Get()
  async generateResponse(): Promise<any> {
    // TODO move to params
    const question = `I am not sure that's a new method or not. But what does Array.every method does?`;
    return await this.appService.generateResponse(question);
  }
}
