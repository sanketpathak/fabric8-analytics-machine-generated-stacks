FROM registry.centos.org/centos/centos:7

MAINTAINER Arunkumar Srisailapathi <asrisail@redhat.com>

RUN mkdir -p /opt/scripts /var/www/html 

ADD dist /var/www/html/

ADD ./fix-permissions.sh ./install.sh ./passwd.template ./run.sh /opt/scripts/

RUN chmod -R 777 /opt/scripts && . /opt/scripts/install.sh

WORKDIR /var/www/html

EXPOSE 8080 8443

USER apache

ENTRYPOINT ["/opt/scripts/run.sh"]
CMD ["apache"]
