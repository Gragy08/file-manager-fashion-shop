import { NextFunction, Request, Response } from "express";

export const checkDomain = (req: Request, res: Response, next: NextFunction) => {
  const referer = req.headers.referer;
  const allowedOrigin = process.env.DOMAIN;
  if(referer !== allowedOrigin) {
    res.send("Truy cập không hợp lệ!");
    return;
  }
  next();
}