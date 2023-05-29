import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { HitCounter } from './hitcounter';
import { Construct } from 'constructs';
import { IndexPage } from './index-page';
import { PurchaseProcess } from './purchase-process';

export class TypescriptCdkWorkshopStack extends cdk.Stack {
  public readonly hcEndpoint: cdk.CfnOutput;
  public readonly indexPageUrl: cdk.CfnOutput;
  public readonly shippingProcessEndpoint: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda definitions
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,    // execution environment
      code: lambda.Code.fromAsset('lambda'),  // code loaded from "lambda" directory
      handler: 'hello.handler'                // file is "hello", function is "handler"
    });

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    });

    const indexPage = new IndexPage(this, 'IndexPage');

    const purchaseProcess = new PurchaseProcess(this, 'PurchaseProcess');

    // API Gateway definitions
    const counterGateway = new apigw.LambdaRestApi(this, 'CounterGatewayEndpoint', {
      handler: helloWithCounter.handler
    });

    const indexPageGateway = new apigw.LambdaRestApi(this, 'IndexPageGatewayEndpoint', {
      handler: indexPage.handler
    });

    const purchaseProcessGateway = new apigw.RestApi(this, 'PurchaseProcessGatewayApi', {
      description: "Puchase items APIs"
    });
    const payItemLambdaPath = purchaseProcessGateway.root.addResource('payItemLambda');
    payItemLambdaPath.addMethod('POST', new apigw.LambdaIntegration(purchaseProcess.payItemHandler));
    const shipItemLambdaPath = purchaseProcessGateway.root.addResource('shipItemLambda');
    shipItemLambdaPath.addMethod('POST', new apigw.LambdaIntegration(purchaseProcess.shipItemHandler));

    // Resources outputs
    this.hcEndpoint = new cdk.CfnOutput(this, 'CounterGatewayUrl', {
      value: counterGateway.url
    });

    this.indexPageUrl = new cdk.CfnOutput(this, 'IndexPageGatewayUrl', {
      value: indexPageGateway.url
    });

    this.shippingProcessEndpoint = new cdk.CfnOutput(this, 'ShippingProcessEndpoint',{
      value: purchaseProcessGateway.url
    });
  }
}
