import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { DocumentParserService } from './document-parser/document-parser.service';
import { ClaudeService } from './claude/claude.service';
import { ClaudePromptService } from './claude/claude-prompt.service';
import { ClaudeJsonParserService } from './claude/claude-json-parser.service';
import { ClaudeConfidenceService } from './claude/claude-confidence.service';
import { ClaudeApiService } from './claude/claude-api.service';
import { UploadController } from './document-parser/document.controller';
import { DocumentValidationService } from './document-parser/document-validation.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      }
    })
  ],
  controllers: [UploadController],
  providers: [
    DocumentParserService,
    ClaudeService,
    ClaudePromptService,
    ClaudeJsonParserService,
    ClaudeConfidenceService,
    ClaudeApiService,
    DocumentValidationService,
  ],
  exports: [ClaudeService],
})
export class AppModule { }
