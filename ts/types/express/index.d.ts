import { File } from "formidable";
declare module "express-serve-static-core" {
  interface Request {
    imgFile: File;
    imgBuf: Buffer;
  }
}
