import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class PurchaseProcess extends Construct {

    public readonly payItemHandler: lambda.Function;
    public readonly shipItemHandler: lambda.Function;
    public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new dynamodb.Table(this, 'Shipping', {
        partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
        encryption: dynamodb.TableEncryption.AWS_MANAGED,
        readCapacity: 5
    });

    this.payItemHandler = new lambda.Function(this, 'PayItemHandler', {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'pay-item.handler',
        code: lambda.Code.fromAsset('lambda'),
        environment: {
            HITS_TABLE_NAME: this.table.tableName
        }
    });

    this.shipItemHandler = new lambda.Function(this, 'ShipItemHandler', {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'ship-item.handler',
        code: lambda.Code.fromAsset('lambda'),
        environment: {
            HITS_TABLE_NAME: this.table.tableName
        }
    });

    this.table.grantReadWriteData(this.payItemHandler);
    this.table.grantReadWriteData(this.shipItemHandler);
  }
}