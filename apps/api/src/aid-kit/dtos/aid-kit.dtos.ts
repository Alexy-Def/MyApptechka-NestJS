import { ApiPropertyString } from '@ppx-node/api-decorators';

export class SendFeedbackBodyDTO {
  @ApiPropertyString()
  public message: string;
}
