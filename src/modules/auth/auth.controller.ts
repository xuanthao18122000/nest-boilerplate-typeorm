import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { GetUser } from 'src/common/decorators/user.decorator';
import { SendResponse } from 'src/common/response/send-response';
import { User } from 'src/database/entities';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, UpdateProfileDto } from './dto/auth.dto';
import {
  SuccessLoginResponse,
  NotFoundLoginResponse,
  WrongPasswordLoginResponse,
  SuccessRegisterResponse,
  ExistedRegisterResponse,
  SuccessLogoutResponse,
  SuccessUpdateProfileResponse,
  SuccessGetProfileResponse,
} from './response';

@ApiTags('2. Auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  @ApiOkResponse(SuccessLoginResponse)
  @ApiNotFoundResponse(NotFoundLoginResponse)
  @ApiBadRequestResponse(WrongPasswordLoginResponse)
  @ApiOperation({ summary: 'Sign In User' })
  async signIn(@Body() body: SignInDto) {
    const data = await this.authService.signIn(body);
    return SendResponse.success(data, 'Sign in user successful!');
  }

  @Public()
  @Post('sign-up')
  @ApiOkResponse(SuccessRegisterResponse)
  @ApiConflictResponse(ExistedRegisterResponse)
  @ApiOperation({ summary: 'Sign Up User' })
  async signUp(@Body() body: SignUpDto) {
    const user = await this.authService.signUp(body);
    return SendResponse.success(user.serialize(), 'Sign up user successful!');
  }

  @Post('sign-out')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign Out User' })
  @ApiOkResponse(SuccessLogoutResponse)
  async signOut(@GetUser() user: User) {
    this.authService.signOut(user);
    return SendResponse.success([], 'Sign out user successful!');
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOkResponse(SuccessGetProfileResponse)
  @ApiOperation({ summary: 'Get Profile User' })
  async getProfile(@GetUser() user: User) {
    return SendResponse.success(
      user.serialize(),
      'Get profile user successful!',
    );
  }

  @Put('profile')
  @ApiBearerAuth()
  @ApiOkResponse(SuccessUpdateProfileResponse)
  @ApiOperation({ summary: 'Update Profile User' })
  async updateProfile(@Body() body: UpdateProfileDto, @GetUser() user: User) {
    const updatedUser = await this.authService.updateProfile(body, user);
    return SendResponse.success(
      updatedUser.serialize(),
      'Update profile user successful!',
    );
  }
}
