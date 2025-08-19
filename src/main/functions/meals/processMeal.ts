import { MealsQueueConsumer } from '@application/queues/MealsQueueConsumer';
import { Registry } from '@kernel/di/Registry';
import { lambdaSQSAdapter } from '@main/adapters/lambdaSQSAdapter';
import 'reflect-metadata';

const consumer = Registry.getInstance().resolve(MealsQueueConsumer);

export const handler = lambdaSQSAdapter(consumer);
