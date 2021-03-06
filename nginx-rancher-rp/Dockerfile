FROM nginx:1.11.3
MAINTAINER Olivier ORABONA oorabona@agefos-pme.com

# Install wget and install/updates certificates
RUN apt-add-repository ppa:chris-lea/node.js
RUN apt-get update \
 && apt-get install -y -q --no-install-recommends \
    ca-certificates \
    wget \
    curl \
    build-essential \
    nodejs \
 && apt-get clean \
 && rm -r /var/lib/apt/lists/*

# Configure Nginx and apply fix for very long server names
RUN echo "daemon off;" >> /etc/nginx/nginx.conf \
 && sed -i 's/^http {/&\n    server_names_hash_bucket_size 128;/g' /etc/nginx/nginx.conf

COPY . /app/
WORKDIR /app/

RUN mkdir /etc/nginx/logs
RUN chmod u+x /app/docker-entrypoint.sh /app/app.js

ENV RANCHER_METADATA_HOST http://rancher-metadata/
ENV RANCHER_VERSION v1

VOLUME ["/etc/nginx/certs", "/etc/nginx/conf.d"]

ENTRYPOINT ["/app/docker-entrypoint.sh"]

CMD ["./app.js"]
