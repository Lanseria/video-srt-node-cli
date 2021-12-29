export class Oss {
  letEndpoint!: string;
  AccessKeyId!: string;
  AccessKeySecret!: string;
  BucketName!: string; //yourBucketName
  //yourBucketName
  BucketDomain!: string; //Bucket 域名
  //Bucket 域名

  getListBuckets() {
    throw new Error('');
  }

  uploadFile() {
    throw new Error('');
  }

  getObjectFileUrl(objectFile: string) {
    return this.BucketDomain + '/' + objectFile;
  }
}
