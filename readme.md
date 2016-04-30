aws lambda function to convert modulus webhooks for slack

to use it, place your slack webhook url in index.js and set proper role in deploy.sh and run deploy.sh (aws cli tools have to be setup)

after that you need to make web gateway for your lambda function and set url as webhook for modulus

this code is based for https://gist.github.com/andrewtamura/81cb43f86f332be46187