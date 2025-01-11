import { ApiPropertyId, ApiPropertyString } from '@ppx-node/api-decorators';
import { Expose } from 'class-transformer';

import { IdDTO } from '@libs/dtos';

export class GetUserByIdParamsDTO extends IdDTO {}
export class UnlockCustomerAccessQueryDTO extends IdDTO {}

export class GetUserByIdResponseDTO {
  @Expose()
  @ApiPropertyId()
  public id: number;

  @Expose()
  @ApiPropertyString()
  public email: string;

  @Expose()
  @ApiPropertyString()
  public username: string;
}
