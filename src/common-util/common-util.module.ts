import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './common-util.constants';
@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useValue: new PubSub(),
    },
  ],
  exports: [PUB_SUB],
})
export class CommonUtilModule {}
