# Welcome to your CDK TypeScript project

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`TypescriptCdkWorkshopStack`)

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Disclaimers

### About the table view construct

I'm not supporting the table view construct to show the dynamo db table since AWS is restricting old node versions in which that table view is builded.

### About the code pipeline constructor

Since Anthology is working with GitHub, I've preffered to use [GitHub connections](https://docs.aws.amazon.com/codepipeline/latest/userguide/connections-github.html) with the suggested [connection function by AWS CDK official docs](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_pipelines.CodePipelineSource.html#static-connectionrepostring-branch-props) to avoid exposing OAuth tokens in code as indicated [here](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_pipelines.CodePipelineSource.html#static-gitwbrhubrepostring-branch-props).

### About extra excercises

#### Description

Create a stack that implements and deploy necessary infrastructure to cover the following use cases (no manual configuration will be allowed):

1. As a user I would like to access a website that has a index page in it.

2. As a user I would like to hit an API call that execute a purchase process of a given item (no need for multiple items). This  process should cover:
    1. Send the item to be processed to account payable 
    2. Send the item to be processed by shipping.

#### Solution

1. See the `lambda/index-page.js` file.
2. Lambdas:
    1. `lambda/pay-item.js`: Responsible for pay any item (just store in dynamo db).
    2. `lambda/ship-item.js`: Responsible for shipping an existing item (updating `is_shipped` field of an existing item in dynamo db).