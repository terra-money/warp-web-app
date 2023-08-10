FROM node:16 as builder_stage_1

WORKDIR /build

COPY package.json yarn.lock ./

# we are using a local version of yarn plus plugins
COPY .yarnrc.yml ./
COPY .yarn/plugins ./.yarn/plugins
COPY .yarn/releases ./.yarn/releases

RUN yarn install

###########################################################

FROM node:16 as builder_stage_2

COPY --from=builder_stage_1 /build /build

WORKDIR /build

COPY indexers/shared/package.json ./indexers/shared/package.json
COPY indexers/warp-protocol/package.json ./indexers/warp-protocol/package.json
COPY apps/shared-api/package.json ./apps/shared-api/package.json
COPY apps/warp-protocol-api/package.json ./apps/warp-protocol-api/package.json

RUN yarn install

###########################################################

FROM node:16 as builder_stage_3

COPY --from=builder_stage_2 /build /build

WORKDIR /build

COPY indexers/shared ./indexers/shared
COPY indexers/warp-protocol ./indexers/warp-protocol
COPY apps/shared-api ./apps/shared-api
COPY apps/warp-protocol-api ./apps/warp-protocol-api

RUN yarn workspace @warp-protocol/api build

###########################################################
FROM public.ecr.aws/lambda/nodejs:16

WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder_stage_3 /build/apps/warp-protocol-api/dist .

CMD ["./lambda.handler"]