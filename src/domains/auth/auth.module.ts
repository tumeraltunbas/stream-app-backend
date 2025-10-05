import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthOrchestration } from './auth.orchestration';
import { AuthRepository } from './auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from '../../models/entities/user-token';

@Module({
    imports: [UserModule, TypeOrmModule.forFeature([UserToken])],
    providers: [AuthService, AuthOrchestration, AuthRepository],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
