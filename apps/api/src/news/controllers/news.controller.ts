import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResponseInfo } from '@modules/core/api-responses';

import { CreateNewsBodyDto } from '../dtos';
import { NewsService } from '../services';

@Controller('news')
@ApiTags('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('publish')
  @ResponseInfo()
  async sendNews(@Body() body: CreateNewsBodyDto): Promise<void> {
    await this.newsService.createNews(body);
  }
}
