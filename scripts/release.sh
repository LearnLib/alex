#!/bin/bash

#------------------------------------------------
# Main
#------------------------------------------------

# variables
alex_version=$(grep -oPm1 "(?<=<version>)[^<]+" pom.xml)
build_dir=target/alex_release

# prepare
mvn clean

# build alex
./scripts/build.sh

# create the documentation
mvn site -Pdeploy
mvn site:stage

# create build direcotry if needed
mkdir -p $build_dir

# cheerypick everything
cp main/target/alex.war $build_dir/ALEX.war
cp standalone/target/standalone-1.0-SNAPSHOT-jar-with-dependencies.jar $build_dir/ALEX.jar
cp -r target/staging $build_dir/documentation

# build the archive
tar -czf target/ALEX-$alex_version.tar.gz -C $build_dir .

# done
exit 0