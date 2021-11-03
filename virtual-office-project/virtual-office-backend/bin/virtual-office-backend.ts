#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { VirtualOfficeBackendStack } from '../lib/virtual-office-backend-stack';

const app = new cdk.App();
new VirtualOfficeBackendStack(app, 'VirtualOfficeBackendStack');
