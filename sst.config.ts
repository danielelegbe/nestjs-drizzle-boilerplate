/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sst-nestjs-ecs",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          profile: "personal",
          region: "eu-west-2",
        },
      },
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc("NestjsSSTVPC");

    const cluster = new sst.aws.Cluster("NestjsSSTCluster", { vpc });

    const db = new sst.aws.Postgres("NestjsSSTPostgres", { vpc });

    cluster.addService("NestjsSSTService", {
      link: [db],
      image: {
        context: "./app",
        args: {
          PORT: "80",
        },
      },
      public: {
        ports: [{ listen: "80/http" }],
      },
    });
  },
});
