# MNA Legal Agent - Backend

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.0.0 or later)
- npm (comes with Node.js)
- TypeScript

## Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/mna-legal-agent.git
cd mna-legal-agent/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root and add necessary environment variables:
```
CLAUDE_API_KEY=your_claude_api_key_here
PORT=3000
```

## Running the Application

### Development Mode
```bash
# Start the development server with hot reloading
npm run start
```

### Production Mode
```bash
# Compile the TypeScript code
npm run build

# Start the production server
npm run start:prod
```

## Testing

### Running Tests

```bash
# Run unit tests
npm run test

# Run end-to-end (e2e) tests
npm run test:e2e

# Generate test coverage report
npm run test:cov
```

### Debugging Tests

1. **Using Node Inspector**:
```bash
# Debug unit tests
npm run test:debug

# Debug e2e tests
npm run test:e2e:debug
```

### vsCode launch setting for testing e2e
```
        {
            "type": "node",
            "request": "launch",
            "name": "Debug E2E Test",
            "program": "${workspaceFolder}/backend/node_modules/.bin/jest",
            "args": [
                "--config",
                "${workspaceFolder}/backend/test/jest-e2e.json",
                "document-processing.e2e-spec.ts",
                "--runInBand",
                "--no-cache",
                "--verbose"
            ],
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen",
            "env": {
                "NODE_ENV": "test"
            },
            "cwd": "${workspaceFolder}/backend"
        }
```

2. **Visual Studio Code Debugging**:
   - Create a `.vscode/launch.json` file with the following configuration:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "node",
         "request": "launch",
         "name": "Jest Current File",
         "program": "${workspaceFolder}/node_modules/.bin/jest",
         "args": [
           "${fileBasenameNoExtension}",
           "--config",
           "jest.config.js"
         ],
         "console": "integratedTerminal",
         "internalConsoleOptions": "neverOpen"
       }
     ]
   }
   ```

## Project Structure

- `src/`: Source code
  - `claude/`: Claude AI service and related modules
  - `document-parser/`: Document parsing logic
  - `app.module.ts`: Main application module
  - `main.ts`: Application entry point

## Common Issues and Troubleshooting

1. **Dependency Conflicts**:
   ```bash
   # Clear npm cache
   npm cache clean --force

   # Reinstall dependencies
   rm -rf node_modules
   npm install
   ```

2. **API Key Issues**:
   - Ensure `CLAUDE_API_KEY` is correctly set in the `.env` file
   - Check API key permissions and validity

3. **Port Conflicts**:
   - Change the `PORT` in `.env` if port 3000 is already in use
   - Use `lsof -i :3000` to check port usage

## Logging and Monitoring

- The application uses NestJS's built-in logging
- Logs are output to the console during development
- Configure log levels in `src/main.ts`

## Performance Optimization

- Use `npm run start:prod` for production
- Enable caching mechanisms
- Monitor memory usage with `node --inspect`

## API Documentation

- Swagger/OpenAPI documentation can be accessed at `/api` when the server is running

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[Specify your project's license here]

## Contact

- Project Maintainer: [Your Name]
- Project Link: [https://github.com/your-username/mna-legal-agent]

## Acknowledgments

- [NestJS](https://nestjs.com/)
- [Claude AI](https://www.anthropic.com/)
