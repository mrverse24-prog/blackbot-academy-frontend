FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

# Force rebuild - $(date)
CMD ["serve", "-s", "build", "-l", "3000"]
