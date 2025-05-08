import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { token, user } = await this.authService.login(loginDto);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    });
    return { user };
  }

  @Get('me')
  async me(@Req() req: Request, @Res() res: Response) {
    console.log('Cookies:', req.cookies); // Debug log
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ user: null, message: 'Unauthorized' });
    }
    try {
      const payload = await this.authService['jwtService'].verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
      });
      const user = await this.authService['prisma'].user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, name: true, role: true, imageUrl: true },
      });
      if (!user) return res.status(401).json({ user: null, message: 'Unauthorized' });
      return res.json({ user });
    } catch {
      return res.status(401).json({ user: null, message: 'Unauthorized' });
    }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    });
    return { success: true };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // This route initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const { token, user } = req.user;
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
} 