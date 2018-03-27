#!/bin/sh

# OGV Build script
OUT="../OGV-build-$(date +'%d%m%Y%S')"; 
echo "# Building OGV"
echo "# If you are going to use OGV on another platform make sure to specify that platform with --architecture parameter inside a script"

# Create folder
mkdir $OUT
echo "# Created folder $OUT"

# Build 
echo "# Building... "
meteor build $OUT  --architecture=os.linux.x86_64
echo "# Finished building to $OUT/OGV.tar.gz"

# Unpack tar
echo "# Unpacking app..."
(cd $OUT; tar -xzf OGV.tar.gz)
echo "# Unpacked app to $OUT/bundle"

# Clean up
echo "# Cleaning up"
rm -rf $OUT/OGV.tar.gz
echo "# Removed OGV.tar.gz"

# Install deps
echo "# Installing dependencies..."
#(cd $OUT/bundle/programs/server && npm install)
echo "# Installed dependencies"

# Create script
echo "MONGO_URL=mongodb://localhost/meteor ROOT_URL=http://localhost PORT=3000 node main.js" > $OUT/bundle/run.sh
chmod +x $OUT/bundle/run.sh
echo "# Created script at $OUT/bundle/run.sh"

# Final notes
echo "
# ---------------------------------------------------------
# 
# Built app is at $OUT/bundle
# To run OGV, go to $OUT/bundle and start ./run.sh
# Then open http://localhost:3000
# Make sure you have mongo running
#
# If you encountered any problems please open issue at
#     https://github.com/BRL-CAD/OGV-meteor/issues"




