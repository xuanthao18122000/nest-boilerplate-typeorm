import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendResponse } from 'src/common/response/send-response';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async signUp(@Body() body: any) {
    const user = await this.authService.signUp(body);
    return SendResponse.success(user, 'Sign Up user successful');
  }

  @Post()
  async signIn(@Body() body: any) {
    const user = await this.authService.signIn(body);
    return SendResponse.success(user, 'Sign In user successful');
  }
}
