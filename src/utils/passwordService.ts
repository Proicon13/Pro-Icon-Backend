import * as bcrypt from 'bcrypt';

export class PasswordService {
  // Hash the password (Encrypt)
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  // Compare the password (Decrypt)
  static async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }
}
