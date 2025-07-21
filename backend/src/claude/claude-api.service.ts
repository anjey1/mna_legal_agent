/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ClaudeApiService {
    private readonly logger = new Logger(ClaudeApiService.name);

    constructor(private configService: ConfigService) { }

    async callClaudeAPI(prompt: string): Promise<string> {
        const apiKey = this.configService.get<string>('CLAUDE_API_KEY');

        if (!apiKey) {
            this.logger.error('Claude API key is not configured');
            throw new Error('Claude API key is not configured');
        }

        try {
            const response = await axios.post(
                'https://api.anthropic.com/v1/messages',
                {
                    model: 'claude-3-opus-20240229',
                    max_tokens: 4096,
                    messages: [
                        {
                            role: 'user',
                            content: [{ type: 'text', text: prompt }],
                        },
                    ],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey,
                        'anthropic-version': '2023-06-01',
                    },
                    timeout: 30000, // 30 seconds timeout
                },
            );

            // Validate response structure
            if (
                !response.data ||
                !response.data.content ||
                !response.data.content[0]
            ) {
                throw new Error('Invalid Claude API response structure');
            }

            return response.data.content[0].text;
        } catch (error) {
            this.logger.error('Claude API Call Error', {
                message: error.message,
                code: error.code,
                stack: error.stack,
            });

            throw error;
        }
    }
} 