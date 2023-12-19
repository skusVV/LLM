import { Controller, Get } from '@nestjs/common';
import { UrlService } from './url.service';

@Controller('/api/url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get()
  async getContentByUrl(): Promise<any> {
    const url =
      'https://www.washingtonpost.com/world/2023/12/19/volodymyr-zelensky-ukraine-news-conference/';
    const translationLanguage = 'Ukrainian';

    return await this.urlService.test(url, translationLanguage);
  }
}
