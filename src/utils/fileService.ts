import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class FileService {
  private readonly uploadDirectory = path.join(__dirname, "..", "..");

  /**
   * Deletes a file from the local file system based on its URL
   * @param fileUrl The file URL (e.g. http://localhost:3000/uploads/clients/imagebh3V7Rgi.jpg)
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const filePath = this.getFilePathFromUrl(fileUrl);
      console.log(`Attempting to delete file at: ${filePath}`); // Debugging step

      // Check if the file exists asynchronously
      await fs.promises.access(filePath, fs.constants.F_OK);

      // If the file exists, remove it
      await fs.promises.unlink(filePath);
      console.log(`File ${filePath} deleted successfully`);
    } catch (error) {
      // Provide more specific error handling and logging
      console.error(`Error deleting file ${fileUrl}:`, error.message || error);
    }
  }

  /**
   * Converts the URL to a local file system path
   * @param fileUrl The file URL (e.g. http://localhost:3000/uploads/clients/imagebh3V7Rgi.jpg)
   * @returns The local file system path
   */
  private getFilePathFromUrl(fileUrl: string): string {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      throw new Error("BASE_URL is not defined in the environment.");
    }
    // Remove the base URL (e.g., http://localhost:3000)
    const relativePath = fileUrl.replace(baseUrl, "");
    console.log(`Relative path extracted: ${relativePath}`); // Debugging step

    // Ensure no double slashes in the path
    const cleanedPath = relativePath.replace(/\/+/g, "/");

    // Return the full path by joining the upload directory and relative path
    return path.join(this.uploadDirectory, cleanedPath);
  }
}
