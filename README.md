# impacts sdk
java -jar ~/bin/swagger-codegen-cli.jar generate -i http://localhost:3333/v1/api/impact-json -l typescript-axios -o impacts/src/typescript

# estimations sdk
java -jar ~/bin/swagger-codegen-cli.jar generate -i http://localhost:3333/v1/api/estimations-json -l typescript-axios -o estimations/src/typescript