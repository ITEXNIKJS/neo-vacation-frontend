# Build Stage
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy application code
COPY . .

# Install Prisma CLI
RUN yarn global add prisma

# Generate Prisma client
RUN yarn prisma generate

# Build the Remix app
RUN yarn run build

# Production Stage
FROM node:18-alpine AS production
WORKDIR /app

# Copy built files from the build stage
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/yarn.lock ./yarn.lock
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Install production dependencies
RUN yarn install --production

# Expose the port the app will run on
EXPOSE 3000

# Start the app
CMD ["yarn", "run", "start"]