FROM node

WORKDIR /app/

COPY ./package.json .
COPY ./ormconfig.json .
COPY ./tsconfig.json .

# RUN npm i -g yarn
RUN yarn install --prod

COPY . .

ENV NODE_ENV development

EXPOSE 4000

CMD yarn start

# docker run --name redis1 -d -p 6379:6379 redis