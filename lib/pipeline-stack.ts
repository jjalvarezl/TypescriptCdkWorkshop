import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CodeBuildStep, CodePipeline, CodePipelineSource} from "aws-cdk-lib/pipelines";
import { TypescriptCdkWorkshopPipelineStage } from './pipeline-stage';


export class TypescriptCdkWorkshopStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'WorkshopPipeline',
            synth: new CodeBuildStep('SynthStep', {
                    input: CodePipelineSource.connection("jjalvarezl/TypescriptCdkWorkshop", "master", {
                        connectionArn: 'arn:aws:codestar-connections:us-east-1:257597320193:connection/a5d2cd82-dc32-45fe-955b-9702b86c13ff'
                    }),
                    installCommands: [
                        'npm install -g aws-cdk'
                    ],
                    commands: [
                        'npm ci',
                        'npm run build',
                        'npx cdk synth'
                    ]
                }
            )
        });

        const deploy = new TypescriptCdkWorkshopPipelineStage(this, 'Deploy');
        const deployStage = pipeline.addStage(deploy);

        deployStage.addPost(
            new CodeBuildStep('TestAPIGatewayEndpoint', {
                projectName: 'TestAPIGatewayEndpoint',
                envFromCfnOutputs: {
                    COUNTER_ENDPOINT_URL: deploy.hcEndpoint,
                    INDEX_PAGE_URL: deploy.indexPageUrl,
                    SHIPPING_PROCESS_URL: deploy.shippingProcessUrl,
                },
                commands: [
                    'echo $COUNTER_ENDPOINT_URL',
                    'echo $INDEX_PAGE_URL',
                    'echo $SHIPPING_PROCESS_URL',
                    'curl -Ssf $COUNTER_ENDPOINT_URL',
                    'curl -Ssf $COUNTER_ENDPOINT_URL/hello',
                    'curl -Ssf $COUNTER_ENDPOINT_URL/test',
                    'curl -Ssf $INDEX_PAGE_URL',
                    'curl -X POST -H \'Content-Type: application/json\' -d \'{ "id": "curl-test", "name": "curl-test" }\' -Ssf $SHIPPING_PROCESS_URL/payItemLambda',
                    'curl -X POST -H \'Content-Type: application/json\' -d \'{ "id": "curl-test" }\' -Ssf $SHIPPING_PROCESS_URL/shipItemLambda',
                ]
            })
        )
    }
}