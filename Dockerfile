FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source files
COPY . .

# Build Next.js app
RUN yarn build

EXPOSE 3000

# Start Next.js in production mode
CMD ["yarn", "start"]