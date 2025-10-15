import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export const upload = (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    const saveLinks: {
      folder: string,
      filename: string,
      mimetype: string,
      size: number
    }[] = [];

    const mediaDir = path.join(__dirname, "../media");
    
    files.forEach(file => {
      const filename = `${Date.now()}-${file.originalname}`;
      const savePath = path.join(mediaDir, filename);
      fs.writeFileSync(savePath, file.buffer);
      saveLinks.push({
        folder: "/media",
        filename: filename,
        mimetype: file.mimetype,
        size: file.size
      });
    })

    res.json({
      code: "success",
      message: "Upload thành công!",
      saveLinks: saveLinks
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Lỗi upload!"
    });
  }
}

export const changeFileNamePatch = (req: Request, res: Response) => {
  try {
    const { folder, oldFileName, newFileName } = req.body;

    if(!folder || !oldFileName || !newFileName) {
      res.json({
        code: "error",
        message: "Thiếu thông tin cần thiết!"
      })
      return;
    }

    // Tạo đường dẫn đến file
    const cleanFolder = folder.replace("/", ""); // Loại bỏ dấu /
    const mediaDir = path.join(__dirname, "..", cleanFolder);
    const oldPath = path.join(mediaDir, oldFileName);
    const newPath = path.join(mediaDir, newFileName);

    if(!fs.existsSync(oldPath)) {
      res.json({
        code: "error",
        message: "File không tồn tại!"
      })
      return;
    }

    if(fs.existsSync(newPath)) {
      res.json({
        code: "error",
        message: "Tên file mới đã tồn tại!"
      })
      return;
    }

    // Đổi tên file
    fs.renameSync(oldPath, newPath);

    res.json({
      code: "success",
      message: "Thành công!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Lỗi server khi đổi tên file!"
    })
  }
}