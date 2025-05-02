import { ApiPropertyString } from '@ppx-node/api-decorators';

export class CreateNewsBodyDto {
  @ApiPropertyString()
  public text: string;
}
