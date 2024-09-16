import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from '../entity/user.entity'; // Import your User entity
import { UserController } from './user.controller'; // Assuming you have a controller

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Register the User entity
  ],
  providers: [UserService],
  controllers: [UserController], // Assuming you have a controller
  exports: [UserService], // Export if other modules need it
})
export class UserModule {}
