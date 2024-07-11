/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    NestjsSSTPostgres: {
      clusterArn: string
      database: string
      secretArn: string
      type: "sst.aws.Postgres"
    }
    NestjsSSTService: {
      type: "sst.aws.Service"
      url: string
    }
  }
}
export {}