#!/usr/bin/env bash

# lambda fuction name
LAMBDA_FUNCTION_NAME="modulus2slack"

#  settings for lambda function
ROLE="LAMBDA_ROLE"
TIMEOUT="15"
MEMORY="128"

#full path for deploy zip
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ZIP="$DIR/deploylambda.zip"

# make sure node modules up2 date
npm --save install

# create zip for deploy
rm -fr $ZIP
zip -r -X $ZIP .

# create or update method
CMD="aws lambda list-functions"
RES=$( $CMD )
if [[ $RES == *"$LAMBDA_FUNCTION_NAME"* ]]; then
    echo "update method in aws ($LAMBDA_FUNCTION_NAME)"

    aws lambda update-function-code \
        --function-name $LAMBDA_FUNCTION_NAME \
        --zip-file fileb://$ZIP

    aws lambda update-function-configuration \
        --function-name $LAMBDA_FUNCTION_NAME \
        --role $ROLE \
        --handler index.handler \
        --timeout $TIMEOUT \
        --memory-size $MEMORY

else
    echo "create method in aws ($LAMBDA_FUNCTION_NAME)";

    aws lambda create-function \
        --function-name $LAMBDA_FUNCTION_NAME \
        --role $ROLE \
        --handler index.handler \
        --runtime nodejs \
        --timeout $TIMEOUT \
        --memory-size $MEMORY \
        --zip-file fileb://$ZIP

fi

#cleanup
rm -fr $ZIP

sleep 1;

echo "create api gateway for this lambda function and give this url to modulus as webhook"