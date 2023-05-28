import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Res,
    SetMetadata,
    Sse,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ProgramService } from './program.service';
import { NewProgramInfo, ProgramConfigType } from './program.class';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody } from '@nestjs/swagger';
import { Express } from 'express';

@Controller('/program')
export class ProgramController {
    constructor(private readonly programService: ProgramService) {}

    @Get('/')
    getAppList() {
        return this.programService.getAppList();
    }

    @Get('/uninstall')
    uninstallApp(@Query() param: any) {
        return this.programService.uninstallApp(param?.name);
    }

    @Post('/update_config')
    updateAppConfig(@Body() param: { name: string; version: string; config: Array<ProgramConfigType> }) {
        return this.programService.updateAppConfig(param);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.programService.saveFile(file.originalname, file.buffer);
    }

    @Post('/add')
    addProgram(@Body() param) {
        console.log(param);

        return this.programService.addProgram({
            ...param,
            programPkg: param.programPkg[0].name,
        });
    }
}
