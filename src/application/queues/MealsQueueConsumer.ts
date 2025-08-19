import { IQueueConsumer } from '@application/contracts/IQueueConsumer';
import { MealsQueueGateway } from '@infra/gateways/MealsQueueGateway';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class MealsQueueConsumer
  implements IQueueConsumer<MealsQueueGateway.Message>
{
  async process(message: MealsQueueGateway.Message): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
