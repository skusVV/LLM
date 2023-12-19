import { Module } from '@nestjs/common';
import { ChatController } from './chat/chat.controller';
import { PdfController } from './pdf/pdf.controller';
import { PdfService } from './pdf/pdf.service';
import { ChatService } from './chat/chat.service';
import { TemplateService } from './common/services/template.service';
import { UrlController } from './url/url.controller';
import { UrlService } from './url/url.service';

@Module({
  imports: [],
  controllers: [ChatController, PdfController, UrlController],
  providers: [ChatService, TemplateService, PdfService, UrlService],
})
export class AppModule {}
