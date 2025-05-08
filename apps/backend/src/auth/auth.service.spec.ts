import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should register a new user successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 1,
        email: registerDto.email,
        name: registerDto.name,
        role: 'USER',
      });
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(registerDto);

      expect(result).toEqual({
        token: 'jwt-token',
        user: {
          id: 1,
          email: registerDto.email,
          name: registerDto.name,
          role: 'USER',
        },
      });
    });

    it('should throw UnauthorizedException if email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: registerDto.email,
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash(loginDto.password, 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: loginDto.email,
        password: hashedPassword,
        name: 'Test User',
        role: 'USER',
      });
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        token: 'jwt-token',
        user: {
          id: 1,
          email: loginDto.email,
          name: 'Test User',
          role: 'USER',
        },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: loginDto.email,
        password: 'wrong-hash',
      });

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findOrCreateOAuthUser', () => {
    const oauthUser = {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/photo.jpg',
      accessToken: 'oauth-token',
    };

    it('should find existing user and return auth data', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: oauthUser.email,
        name: oauthUser.name,
        role: 'USER',
      });
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.findOrCreateOAuthUser(oauthUser);

      expect(result).toEqual({
        token: 'jwt-token',
        user: {
          id: 1,
          email: oauthUser.email,
          name: oauthUser.name,
          role: 'USER',
        },
      });
    });

    it('should create new user if not exists and return auth data', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 1,
        email: oauthUser.email,
        name: oauthUser.name,
        role: 'USER',
        imageUrl: oauthUser.picture,
      });
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.findOrCreateOAuthUser(oauthUser);

      expect(result).toEqual({
        token: 'jwt-token',
        user: {
          id: 1,
          email: oauthUser.email,
          name: oauthUser.name,
          role: 'USER',
          imageUrl: oauthUser.picture,
        },
      });
    });
  });
}); 