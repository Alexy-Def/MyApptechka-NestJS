import { ApiPropertyId } from '@ppx-node/api-decorators';

export class IdDTO {
  @ApiPropertyId()
  public id: number;
}
