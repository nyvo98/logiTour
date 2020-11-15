FROM gogojungle/node:10.16.0 AS builder

WORKDIR /usr/src/app

COPY . .

RUN yarn --prod
RUN yarn build

FROM gogojungle/node:10.16.0
WORKDIR /usr/src/app
COPY serve/package.json serve/yarn.lock ./
RUN yarn --prod

COPY --from=builder /usr/src/app/build/. ./build
COPY /start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 3033

CMD [ "/start.sh" ]
