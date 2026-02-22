import { Controller, Post, UseInterceptors, UploadedFile, Body, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConverterService } from './converter.service';
import { multerConfig } from './config/multer.config';
import { ConversionRequestDto } from './dto';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('converter')
export class ConverterController {
  constructor(private readonly converterService: ConverterService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ConversionRequestDto,
    @Res() res: Response
  ): Promise<void> {
    try {
      let outputFormats: string[];
      if (!body.outputFormat) {
        res.status(400).json({ message: 'outputFormat is required' });
        return;
      }

      if (typeof body.outputFormat === 'string') {
        try {
          const parsed = JSON.parse(body.outputFormat) as string[];
          if (Array.isArray(parsed) && parsed.every((f) => typeof f === 'string')) {
            outputFormats = parsed.map((format) => format.toLowerCase());
          } else {
            outputFormats = [body.outputFormat.toLowerCase()];
          }
        } catch {
          outputFormats = [body.outputFormat.toLowerCase()];
        }
      } else if (Array.isArray(body.outputFormat)) {
        outputFormats = body.outputFormat.map((format) => format.toLowerCase());
      } else {
        res.status(400).json({ message: 'outputFormat must be a string or array' });
        return;
      }

      const result = await this.converterService.convertToMultipleFormats(file, outputFormats);
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error('Failed to delete input file:', err);
      }

      if (!result.success) {
        res.status(500).json({ message: result.error || 'Conversion failed' });
        return;
      }

      if (result.filePath) {
        const filename = path.basename(result.filePath);
        res.download(result.filePath, filename, (err) => {
          if (err) {
            console.error('Download error:', err);
            res.status(500).send('Failed to send converted file.');
          } else {
            try {
              if (result.filePath) {
                fs.unlinkSync(result.filePath);
              }
            } catch (deleteErr) {
              console.error('Failed to delete converted file:', deleteErr);
            }
          }
        });
      } else {
        res.status(500).json({ message: 'No output file path returned' });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      res.status(500).json({ message });
    }
  }
}
