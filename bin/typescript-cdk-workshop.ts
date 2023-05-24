#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TypescriptCdkWorkshopStack } from '../lib/typescript-cdk-workshop-stack';

const app = new cdk.App();
new TypescriptCdkWorkshopStack(app, 'TypescriptCdkWorkshopStack');
