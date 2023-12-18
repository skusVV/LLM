import { Controller, Get } from '@nestjs/common';
import { PdfService } from './pdf.service';

@Controller('/api/pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('/upload')
  async initPdfFile(): Promise<any> {
    await this.pdfService.initPdfFile(
      __dirname + '/ECMA-262_13th_edition_june_2022.pdf',
    );
    return 'Success';
  }
}
