# MNA Legal Agent - Frontend

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.0.0 or later)
- pnpm (recommended) or npm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/mna-legal-agent.git
cd mna-legal-agent/client
```

2. Install dependencies:
```bash
pnpm install
# OR if using npm
npm install
```

## Development Server

To start the development server:

```bash
pnpm dev
# OR
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
pnpm build
# OR
npm run build
```

The production-ready files will be in the `dist/` directory.

## Running Tests

To run tests:

```bash
pnpm test
# OR
npm test
```

## Linting

To run the linter:

```bash
pnpm lint
# OR
npm run lint
```

## Project Structure

- `src/`: Source code
  - `components/`: React components
  - `hooks/`: Custom React hooks
  - `utils/`: Utility functions
  - `types.ts`: TypeScript type definitions

## Environment Configuration

1. Create a `.env` file in the project root
2. Add necessary environment variables:
```
VITE_API_BASE_URL=http://localhost:3000/api/documents
```

## Recommended IDE Extensions

- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)

## Troubleshooting

- Ensure you're using a compatible Node.js version
- Clear npm/pnpm cache if you encounter dependency issues:
  ```bash
  pnpm cache clean
  # OR
  npm cache clean --force
  ```

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## License

[Add your project's license information here]
