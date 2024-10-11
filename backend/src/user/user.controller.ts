import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() userDetails: any) {
    return this.userService.register(userDetails);
  }

  @Post('login')
  async login(@Body() loginDetails: { user_name: string; user_pass: string }) {
    return this.userService.login(loginDetails.user_name, loginDetails.user_pass);
  }

  @Post('getUserProfile')
  async getUserProfile(@Body() body: { token: string }) {
    return this.userService.getUserProfile(body.token);
  }

  @Post('change/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: { user_id: number; data: any; password: string },
  ) {
    return this.userService.updateUser(id, body.data, body.user_id, body.password);
  }

  @Get('getUserProfile/:id')
  async getUserProfileById(@Param('id') user_name: string) {
    return this.userService.getUserProfileById(user_name);
  }

  @Post('validate-token')
  async validateToken(@Body('token') token: string) {
    return this.userService.validateToken(token);
  }

  @Post('getUserId')
  async getUserId(@Body('token') token: string) {
    return this.userService.getUserId(token);
  }
}
