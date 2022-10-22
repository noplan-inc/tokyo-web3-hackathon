# If you change this value, please change it in the following files as well:
# /.travis.yml
# /Dockerfile
# /make/builder.Dockerfile
# /.github/workflows/main.yml
# /.github/workflows/release.yml
FROM golang:1.18-alpine as builder

LABEL maintainer="Olaoluwa Osuntokun <laolu@lightning.engineering>"

# Force Go to use the cgo based DNS resolver. This is required to ensure DNS
# queries required to connect to linked containers succeed.
ENV GODEBUG netdns=cgo

# Install dependencies and install/build lnd.
RUN apk add --no-cache --update alpine-sdk \
    git \
    make

WORKDIR $GOPATH/src/github.com/lightningnetwork/lnd

# Copy in the local repository to build from.
RUN git clone --depth 1 https://github.com/lightningnetwork/lnd.git .

RUN pwd
RUN ls -al
RUN go build -v ./cmd/lnd
RUN go build -v ./cmd/lncli
RUN go install -v -tags="signrpc walletrpc chainrpc invoicesrpc" ./cmd/lnd
RUN go install -v -tags="signrpc walletrpc chainrpc invoicesrpc" ./cmd/lncli

# Start a new, final image to reduce size.
FROM alpine as final

# Expose lnd ports (server, rpc).
EXPOSE 9735 10009

# Copy the binaries and entrypoint from the builder image.
COPY --from=builder /go/bin/lncli /bin/
COPY --from=builder /go/bin/lnd /bin/

# Add bash.
RUN apk add --no-cache \
    bash

# Copy the entrypoint script.
COPY start-lnd.sh .
RUN chmod +x start-lnd.sh
