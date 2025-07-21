# MNA Legal Agent

## Application Preview

![Analyzer Page](/demo/analyze.png)
![Enhancment Page](/demo/clause.png)

## Overview
A full-stack document analysis application using Claude AI to extract and enhance legal document insights.

## Project Structure
- `backend/`: NestJS TypeScript backend
- `client/`: React TypeScript frontend

## Prerequisites
- Node.js (v20.x)
- npm or pnpm
- Anthropic Claude API Key

## Setup

### Backend
1. Navigate to backend directory
```bash
cd backend
npm install
```

### Frontend
1. Navigate to frontend directory
```bash
cd client
npm install
```

## Running the Application

### Development Mode
1. Start Backend
```bash
cd backend
npm run start
```

2. Start Frontend
```bash
cd client
npm run dev
```

## Features
- Document upload and parsing
- AI-powered text extraction
- Clause enhancement
- Responsive design

## Technologies
- Backend: NestJS, TypeScript
- Frontend: React, Vite, TypeScript
- AI: Claude API



## CURLS Examples

```
curl 'http://localhost:3000/api/documents/enhance-clause' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Accept-Language: en-US,en;q=0.6' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/json' \
  -H 'Origin: http://localhost:5173' \
  -H 'Pragma: no-cache' \
  -H 'Referer: http://localhost:5173/' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-site' \
  -H 'Sec-GPC: 1' \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Not)A;Brand";v="8", "Chromium";v="138", "Brave";v="138"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Linux"' \
  --data-raw '{"clause":"\"The agreement does not specify the governing law and jurisdiction. This could lead to legal uncertainty in case of any disputes","perspective":"seller"}'
  ```


  ```
  curl 'http://localhost:3000/api/documents/analyze' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Accept-Language: en-US,en;q=0.6' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryvbW3JJvWcRuekzEv' \
  -H 'Origin: http://localhost:5173' \
  -H 'Pragma: no-cache' \
  -H 'Referer: http://localhost:5173/' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-site' \
  -H 'Sec-GPC: 1' \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Not)A;Brand";v="8", "Chromium";v="138", "Brave";v="138"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Linux"' \
  --data-raw $'------WebKitFormBoundaryvbW3JJvWcRuekzEv\r\nContent-Disposition: form-data; name="files"; filename="scenario_3.pdf"\r\nContent-Type: application/pdf\r\n\r\n\r\n------WebKitFormBoundaryvbW3JJvWcRuekzEv--\r\n'
  ```