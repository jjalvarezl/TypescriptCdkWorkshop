import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class IndexPage extends Construct {

  public readonly handler: lambda.Function;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.handler = new lambda.Function(this, 'IndexPageHandler', {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'index-page.handler',
        code: lambda.Code.fromAsset('lambda'),
    });
  }
}