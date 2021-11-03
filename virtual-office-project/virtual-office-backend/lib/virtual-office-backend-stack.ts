import * as cdk from '@aws-cdk/core';
import { Function, AssetCode, Runtime } from '@aws-cdk/aws-lambda';
import { RestApi, LambdaIntegration, IResource, MockIntegration, PassthroughBehavior } from "@aws-cdk/aws-apigateway";
import { Table, AttributeType, ProjectionType } from "@aws-cdk/aws-dynamodb";
import { RetentionDays } from '@aws-cdk/aws-logs';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cloudfront from '@aws-cdk/aws-cloudfront';

//**************************************************** */
// 変数部分は自由に編集してください。
const stage = "prod"; // "stg","prd"
const bucketName = 'virtual-office-web-dev'
const projectName = 'virtual-office-build-webcontent-' + stage; // ステージごとにリポジトリを作り分け可能
const repositoryName = 'virtual-office-client-' + stage;
const branch = 'prod'; // 'release','master'; 
const pipelineName = 'VirtualOfficePipeline-' + stage;
const accessMeetingFuncName = 'access-meeting';
const registerMeetingName = 'register-meeting';
const getMapFunctionName = 'get-map';
const getMapIdFunctionName = 'get-map-id';
const scanChimeMeetingsName = 'scan-chime-meetings';
const registerInvitationName = 'register-invitation';
const getInvitationName = 'get-invitation';
const updateCheckStatusName = 'update-check-status';
const restApiName = 'virtual-office-' + stage;
const officeTableName = 'VIRTUAL_OFFICE_TABLE'
const shareEventTableName = 'SHARE_EVENT_TABLE'
const meetingSessionTableName = 'MEETING_SESSION_TABLE';
const officeMapTableName = 'OFFICE_MAP_TABLE';
//**************************************************** */

export class VirtualOfficeBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //**************************************************** */
    // IAMポリシーの作成
    //**************************************************** */
    const lamdbdaAccessRole = iam.Role.fromRoleArn(this, 'LambdaAccessRole', 'arn:aws:iam::616026021527:role/LambdaAccessRole', {
      // Set 'mutable' to 'false' to use the role as-is and prevent adding new
      // policies to it. The default is 'true', which means the role may be
      // modified as part of the deployment.
      mutable: false,
    });

    //**************************************************** */
    // S3バケットの作成
    //**************************************************** */

    const s3Bucket = new s3.Bucket(this, 'chime-demo-s3-bucket-id', {
      bucketName: bucketName, // バケット名を定義
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    // Create OriginAccessIdentity
    const oai = new cloudfront.OriginAccessIdentity(this, "my-oai");

    // Create Policy and attach to mybucket
    const myBucketPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:GetObject"],
      principals: [
        new iam.CanonicalUserPrincipal(
          oai.cloudFrontOriginAccessIdentityS3CanonicalUserId
        ),
      ],
      resources: [s3Bucket.bucketArn + "/*"],
    });
    s3Bucket.addToResourcePolicy(myBucketPolicy);

    //**************************************************** */
    // CloudFrontの定義
    //**************************************************** */

    // Create CloudFront WebDistribution
    new cloudfront.CloudFrontWebDistribution(this, "WebsiteDistribution", {
      viewerCertificate: {
        aliases: [],
        props: {
          cloudFrontDefaultCertificate: true,
        },
      },
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: s3Bucket,
            originAccessIdentity: oai,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              minTtl: cdk.Duration.seconds(0),
              maxTtl: cdk.Duration.days(0),
              defaultTtl: cdk.Duration.days(0),
              pathPattern: "/*", //ルート直下のファイルを全て参照
            },
          ],
        },
      ],
      errorConfigurations: [
        {
          errorCode: 403,
          responsePagePath: "/index.html",
          responseCode: 200,
          errorCachingMinTtl: 0,
        },
        {
          errorCode: 404,
          responsePagePath: "/index.html",
          responseCode: 200,
          errorCachingMinTtl: 0,
        },
      ],
    });

    //**************************************************** */
    // ビルドプロジェクトの作成
    //**************************************************** */
    const project = new codebuild.PipelineProject(this, 'project', {
      projectName: projectName,
      description: 'some description',
      environment: {
        // 環境変数をbuildspec.ymlに設定
        environmentVariables: {
          S3_BUCKET_ARN: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: s3Bucket.bucketArn,
          }
        },
      }
    });

    // S3へ資源反映するために、S3FullAccessRoleをcodeBuildへ付与
    project.addToRolePolicy(new iam.PolicyStatement({
      resources: [s3Bucket.bucketArn, s3Bucket.bucketArn + '/*'],
      actions: ['s3:*']
    }
    ));

    // パイプラインの生成
    const sourceOutput = new codepipeline.Artifact();
    //**************************************************** */
    // ソースアクションの作成
    //**************************************************** */

    // CodeCommitリポジトリの作成
    const repo = new codecommit.Repository(this, 'Repository', {
      repositoryName: repositoryName,
      description: 'Some description.', // optional property
    });

    const sourceAction = new codepipeline_actions.CodeCommitSourceAction({
      actionName: 'CodeCommit',
      repository: repo,
      branch: branch,
      output: sourceOutput,
    });

    //**************************************************** */
    // ビルドアクションの作成
    //**************************************************** */
    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'CodeBuild',
      project,
      input: sourceOutput,
      outputs: [new codepipeline.Artifact()]
    });

    //**************************************************** */
    // パイプラインの作成
    //**************************************************** */
    new codepipeline.Pipeline(this, 'pipeline', {
      pipelineName: pipelineName,
      stages: [
        {
          stageName: 'Source',
          actions: [
            sourceAction
          ],
        },
        {
          stageName: 'Build',
          actions: [
            buildAction
          ],
        }
      ]
    })

    //**************************************************** */
    // DyanmoDBの作成
    //**************************************************** */
    const virtualOfficeTable: Table = new Table(this, "virtual-office-table", {
      partitionKey: {
        name: "office_id",
        type: AttributeType.NUMBER
      },
      sortKey: {
        name: "start_date",
        type: AttributeType.STRING
      },
      readCapacity: 1,
      writeCapacity: 1,
      pointInTimeRecovery: true,
      timeToLiveAttribute: 'expired_date',
      tableName: officeTableName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    virtualOfficeTable.addGlobalSecondaryIndex({
      indexName: 'userId-index',
      partitionKey: {
        name: 'user_id',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'start_date',
        type: AttributeType.STRING
      },
      projectionType: ProjectionType.ALL
    });

    const meetingSessionTable: Table = new Table(this, "meeting-session-table", {
      partitionKey: {
        name: "session_id",
        type: AttributeType.STRING
      },
      readCapacity: 1,
      writeCapacity: 1,
      pointInTimeRecovery: true,
      tableName: meetingSessionTableName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const officeMapTable: Table = new Table(this, "office-map-table", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      },
      readCapacity: 1,
      writeCapacity: 1,
      pointInTimeRecovery: true,
      tableName: officeMapTableName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const shareEventTable: Table = new Table(this, "share-event-table", {
      partitionKey: {
        name: "office_id",
        type: AttributeType.NUMBER
      },
      sortKey: {
        name: "password",
        type: AttributeType.STRING
      },
      readCapacity: 1,
      writeCapacity: 1,
      pointInTimeRecovery: true,
      timeToLiveAttribute: 'expired_date',
      tableName: shareEventTableName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    shareEventTable.addGlobalSecondaryIndex({
      indexName: 'officeId-index',
      partitionKey: {
        name: "invite_email",
        type: AttributeType.STRING
      },
      sortKey: {
        name: "start_date",
        type: AttributeType.STRING
      },
      projectionType: ProjectionType.ALL
    });
    //**************************************************** */
    //LambdaFunctionの作成
    //**************************************************** */

    const registerMeetingFunc: Function = new Function(this, 'register-meeting-id', {
      functionName: registerMeetingName,
      runtime: Runtime.NODEJS_12_X,
      code: AssetCode.fromAsset('src/lambda'),
      handler: 'registerMeeting.handler',
      timeout: cdk.Duration.seconds(10),
      environment: {
        TZ: "Asia/Tokyo",
        CORS_URL: "*", // 作成したCloudFrontのエンドポイントを指定する
        OFFICE_TABLE: officeTableName,
        SESSION_TABLE: meetingSessionTableName,
        MAP_TABLE: officeMapTableName,
      },
      role: lamdbdaAccessRole,
      logRetention: RetentionDays.TWO_MONTHS,
    });

    const accessMeetingFunc: Function = new Function(this, 'access-meeting-id', {
      functionName: accessMeetingFuncName,
      runtime: Runtime.NODEJS_12_X,
      code: AssetCode.fromAsset('src/lambda'),
      handler: 'accessMeeting.handler',
      timeout: cdk.Duration.seconds(10),
      environment: {
        TZ: "Asia/Tokyo",
        CORS_URL: "*", // 作成したCloudFrontのエンドポイントを指定する
        TABLE_NAME: meetingSessionTableName
      },
      role: lamdbdaAccessRole,
      logRetention: RetentionDays.TWO_MONTHS,
    });

    const getMapFunc: Function = new Function(this, 'get-map', {
      functionName: getMapFunctionName,
      runtime: Runtime.NODEJS_12_X,
      code: AssetCode.fromAsset('src/lambda'),
      handler: 'getMap.handler',
      timeout: cdk.Duration.seconds(10),
      environment: {
        TZ: "Asia/Tokyo",
        CORS_URL: "*", // 作成したCloudFrontのエンドポイントを指定する
        TABLE_NAME: officeMapTableName
      },
      role: lamdbdaAccessRole,
      logRetention: RetentionDays.TWO_MONTHS,
    });

    const getMapIdFunc: Function = new Function(this, 'get-map-id', {
      functionName: getMapIdFunctionName,
      runtime: Runtime.NODEJS_12_X,
      code: AssetCode.fromAsset('src/lambda'),
      handler: 'getMapId.handler',
      timeout: cdk.Duration.seconds(10),
      environment: {
        TZ: "Asia/Tokyo",
        CORS_URL: "*", // 作成したCloudFrontのエンドポイントを指定する
        TABLE_NAME: officeTableName
      },
      role: lamdbdaAccessRole,
      logRetention: RetentionDays.TWO_MONTHS,
    });

    const scanChimeMeetings: Function = new Function(this, 'scan-meeting-id', {
      functionName: scanChimeMeetingsName,
      runtime: Runtime.NODEJS_12_X,
      code: AssetCode.fromAsset('src/lambda'),
      handler: 'scanChimeMeetings.handler',
      timeout: cdk.Duration.seconds(10),
      environment: {
        TZ: "Asia/Tokyo",
        CORS_URL: "*", // 作成したCloudFrontのエンドポイントを指定する
        TABLE_NAME: officeTableName
      },
      role: lamdbdaAccessRole,
      logRetention: RetentionDays.TWO_MONTHS,
    });

    const registerInvitationFunc: Function = new Function(this, 'register-invitation-id', {
      functionName: registerInvitationName,
      runtime: Runtime.NODEJS_12_X,
      code: AssetCode.fromAsset('src/lambda'),
      handler: 'registerInvitation.handler',
      timeout: cdk.Duration.seconds(10),
      environment: {
        TZ: "Asia/Tokyo",
        CORS_URL: "*", // 作成したCloudFrontのエンドポイントを指定する
        TABLE_NAME: shareEventTableName
      },
      logRetention: RetentionDays.TWO_MONTHS,
    });

    const getInvitedEventFunc: Function = new Function(this, 'get-invited-event-id', {
      functionName: getInvitationName,
      runtime: Runtime.NODEJS_12_X,
      code: AssetCode.fromAsset('src/lambda'),
      handler: 'getInvitedEvents.handler',
      timeout: cdk.Duration.seconds(10),
      environment: {
        TZ: "Asia/Tokyo",
        CORS_URL: "*", // 作成したCloudFrontのエンドポイントを指定する
        TABLE_NAME: shareEventTableName
      },
      logRetention: RetentionDays.TWO_MONTHS,
    });

    const updateCheckStatusFunc: Function = new Function(this, 'update-check-status-id', {
      functionName: updateCheckStatusName,
      runtime: Runtime.NODEJS_12_X,
      code: AssetCode.fromAsset('src/lambda'),
      handler: 'updateCheckStatus.handler',
      timeout: cdk.Duration.seconds(10),
      environment: {
        TZ: "Asia/Tokyo",
        CORS_URL: "*", // 作成したCloudFrontのエンドポイントを指定する
        TABLE_NAME: shareEventTableName
      },
      logRetention: RetentionDays.TWO_MONTHS,
    });

    // DyanmoDBへのアクセス権限を付与
    virtualOfficeTable.grantFullAccess(registerMeetingFunc);
    virtualOfficeTable.grantFullAccess(getMapIdFunc);
    virtualOfficeTable.grantFullAccess(scanChimeMeetings);
    meetingSessionTable.grantReadData(registerMeetingFunc);
    meetingSessionTable.grantReadData(accessMeetingFunc);
    officeMapTable.grantFullAccess(registerMeetingFunc);
    shareEventTable.grantFullAccess(registerInvitationFunc);
    shareEventTable.grantFullAccess(getInvitedEventFunc);
    shareEventTable.grantFullAccess(updateCheckStatusFunc);
    //**************************************************** */
    // API Gateway（リソース, メソッド）の作成
    //**************************************************** */
    const api = new RestApi(this, "chime-demo-api-id", {
      restApiName: restApiName,
      cloudWatchRole: true,

    });
    const registerMeeting = api.root.addResource("register-meeting");

    const registerMeetingLambdaIntegration = new LambdaIntegration(registerMeetingFunc);
    registerMeeting.addMethod("POST", registerMeetingLambdaIntegration);
    addCorsOptions(registerMeeting);

    const accessMeeting = api.root.addResource("access-meeting");

    const accessMeetingLambdaIntegration = new LambdaIntegration(accessMeetingFunc);
    accessMeeting.addMethod("POST", accessMeetingLambdaIntegration);
    addCorsOptions(accessMeeting);

    const getMap = api.root.addResource("get-map");

    const getMapLambdaIntegration = new LambdaIntegration(getMapFunc);
    getMap.addMethod("POST", getMapLambdaIntegration);
    addCorsOptions(getMap);

    const getMapId = api.root.addResource("get-map-id");

    const getMapIdLambdaIntegration = new LambdaIntegration(getMapIdFunc);
    getMapId.addMethod("POST", getMapIdLambdaIntegration);
    addCorsOptions(getMapId);

    const scanMeeting = api.root.addResource("scan-meeting");

    const scanMeetingLambdaIntegration = new LambdaIntegration(scanChimeMeetings);
    scanMeeting.addMethod("POST", scanMeetingLambdaIntegration);
    addCorsOptions(scanMeeting);

    const registerInvitation = api.root.addResource("register-invitation");

    const registerInvitationLambdaIntegration = new LambdaIntegration(registerInvitationFunc);
    registerInvitation.addMethod("POST", registerInvitationLambdaIntegration);
    addCorsOptions(registerInvitation);

    const getInvitedEvent = api.root.addResource("get-invited-event");

    const getInvitedEventFuncLambdaIntegration = new LambdaIntegration(getInvitedEventFunc);
    getInvitedEvent.addMethod("POST", getInvitedEventFuncLambdaIntegration);
    addCorsOptions(getInvitedEvent);

    const updateCheckStatus = api.root.addResource("update-check-status");

    const updateCheckStatusLambdaIntegration = new LambdaIntegration(updateCheckStatusFunc);
    updateCheckStatus.addMethod("POST", updateCheckStatusLambdaIntegration);
    addCorsOptions(updateCheckStatus);

  }
}

//**************************************************** */
// API GatewayのメソッドにOPTIONを追加
//**************************************************** */
export function addCorsOptions(apiResource: IResource) {
  apiResource.addMethod(
    "OPTIONS",
    new MockIntegration({
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Credentials": "'false'",
            "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        },
      ],
      passthroughBehavior: PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": '{"statusCode": 200}',
      },
    }),
    {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Methods": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    }
  );
}
