FROM ubuntu:14.04
MAINTAINER bruno@btech.software
ENV REFRESHED_AT 2016-06-13

RUN apt-get update -qq && apt-get install -y curl openjdk-7-jdk git-core

ENV JENKINS_HOME /opt/jenkins/data
ENV JENKINS_MIRROR http://mirrors.jenkins-ci.org

RUN mkdir -p $JENKINS_HOME/plugins
RUN curl -sf -o /opt/jenkins/jenkins.war -L $JENKINS_MIRROR/war-stable/latest/jenkins.war

RUN for plugin in chucknorris greenballs scm-api git-client git ws-cleanup ; do curl -sf -o $JENKINS_HOME/plugins/${plugin}.hpi -L $JENKINS_MIRROR/plugins/${plugin}/latest/${plugin}.hpi ; done

ADD ./jenkins.sh /usr/local/bin/jenkins.sh
RUN chmod +x /usr/local/bin/jenkins.sh

VOLUME /var/lib/docker

ENV SSH_DIR /opt/ssh
RUN apt-get install -y openssh-client
RUN mkdir ${SSH_DIR}
RUN ssh-keygen -t dsa -N "" -f ${SSH_DIR}/id_dsa

RUN apt-get install -y nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm install -g grunt-cli bower

RUN apt-get install -y ruby ruby-dev
RUN gem install compass

EXPOSE 8080

ENTRYPOINT [ "/usr/local/bin/jenkins.sh" ]
