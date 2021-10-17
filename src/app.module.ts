import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BucketModule } from './bucket/bucket.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, AuthModule, BucketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
