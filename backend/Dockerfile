FROM node:22
WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN mkdir -p /cli && \
    curl -L https://github.com/BRL-CAD/brlcad/releases/download/rel-7-40-2/BRL-CAD_7.40.2_Linux_x86_64.tar.bz2 -o /cli/brlcad.tar.bz2 && \
    ls -l /cli && \
    ls -lh /cli/brlcad.tar.bz2 && \
    tar -xvjf /cli/brlcad.tar.bz2 -C /cli && \
    ls -l /cli && \
    chmod -R +x /cli/BRL-CAD_7.40.2_Linux_x86_64 && \
    ls -l /cli/ 

ENV PATH="/cli/BRL-CAD_7.40.2_Linux_x86_64/bin:$PATH"
RUN echo 'export PATH="/cli/BRL-CAD_7.40.2_Linux_x86_64/bin:$PATH"'

RUN mkdir -p ./uploads/upload-api/raw \
    ./uploads/upload-api/converted-to-obj \
    ./uploads/upload-api/thumbnails \
    ./uploads/conversion-api/inputs \
    ./uploads/conversion-api/outputs \
    ./uploads/temp

RUN chmod -R 755 ./uploads

RUN npx prisma generate

RUN yarn build

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && yarn start:prod"]
