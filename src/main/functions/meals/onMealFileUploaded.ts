import 'reflect-metadata';

import { MealUpdloadedFileEventHander } from '@application/events/files/MealUpdloadedFileEventHander';
import { Registry } from '@kernel/di/Registry';
import { lambdaS3Adapter } from '@main/adapters/lambdaS3Adapter';

const eventHandler = Registry.getInstance().resolve(
  MealUpdloadedFileEventHander,
);

export const handler = lambdaS3Adapter(eventHandler);
