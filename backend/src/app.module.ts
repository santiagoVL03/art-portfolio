import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DrawingsModule } from './drawings/drawings.module';
import { HealthController } from './health.controller';

@Module({
  imports: [AuthModule, DrawingsModule],
  controllers: [HealthController],
})
export class AppModule {}
