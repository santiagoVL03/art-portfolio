import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DrawingsController } from './drawings.controller';
import { DrawingsService } from './drawings.service';

@Module({
  imports: [AuthModule],
  controllers: [DrawingsController],
  providers: [DrawingsService],
})
export class DrawingsModule {}
