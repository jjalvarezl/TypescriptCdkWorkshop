#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TypescriptCdkWorkshopStack } from '../lib/pipeline-stack';

const app = new cdk.App();
new TypescriptCdkWorkshopStack(app, 'TypescriptCdkWorkshopStack');
