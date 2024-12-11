import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'The unique identifier of the user' })
  id: number;

  @ApiProperty({ description: 'The email address of the user' })
  email: string;

  @ApiProperty({ description: 'The full name of the user' })
  fullname: string;

  @ApiProperty({ description: 'The profile image URL of the user' })
  image: string;

  @ApiProperty({ description: 'The role of the user' , enum: ['MANAGER', 'ADMIN']})
  role: string;

  @ApiProperty({ description: 'The timestamp when the user was created' })
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the user was last updated' })
  updatedAt: Date;
}
