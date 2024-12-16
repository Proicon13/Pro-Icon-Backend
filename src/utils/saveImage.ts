import * as fs from 'fs';
import * as path from 'path';
import { generateRandomString } from './generateRandomString';

export  async function  handleImageUploads(image: Express.Multer.File, folder:string) {
  const userDir = path.join(`./uploads/${folder}`);


  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

 

  const ImageUrl = `${process.env.BASE_URL}/uploads/${folder}/${image.filename}`;

  // save image
  const filename = `image${generateRandomString(8)}.jpg`;
    const imagePath = path.join(userDir, filename);
    fs.writeFileSync(imagePath, image.buffer);


    return `${process.env.BASE_URL}/uploads/${folder}/${filename}`;

}