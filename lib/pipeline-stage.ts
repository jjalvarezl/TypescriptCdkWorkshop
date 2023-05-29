import { TypescriptCdkWorkshopStack } from './typescript-cdk-workshop-stack';
import { CfnOutput, Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class TypescriptCdkWorkshopPipelineStage extends Stage {
    public readonly hcEndpoint: CfnOutput;
    public readonly indexPageUrl: CfnOutput;
    public readonly shippingProcessUrl: CfnOutput;
    
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        const service = new TypescriptCdkWorkshopStack(this, 'WebService');

        this.hcEndpoint = service.hcEndpoint;

        this.indexPageUrl = service.indexPageUrl;

        this.shippingProcessUrl = service.shippingProcessEndpoint;
    }
}