import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { ChatService } from './chat.service';
import { TemplateService } from './services/template.service';

@Module({
  imports: [],
  controllers: [ChatController, PdfController],
  providers: [ChatService, TemplateService, PdfService],
})
export class ChatModule {}
