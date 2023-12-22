const aws = require('aws-sdk')

const endpoint = new aws.Endpoint(process.env.ENDPOINT_S3)

const s3 = new aws.S3({
    endpoint,
    credentials: {
        accessKeyId: process.env.kEY_ID,
        secretAccessKey: process.env.APP_KEY
    }
});

const arquivoUpload = async (file, descricao) => {
    const resultado = await s3.upload({
        Bucket: process.env.BUCKET_NAME,
        Key: `img/${descricao}.${file.originalname.split('.')[1]}`,
        Body: file.buffer,
        ContentType: file.mimetype
    }).promise();

    return resultado;
};

const excluirImagem = async (key) => {
    await s3.deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: key
    }).promise()
};

const obterUrlImagem = async (key) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Expires: 60,
    };

    const url = await s3.getSignedUrlPromise('getObject', params);
    return url;
};

module.exports = {
    arquivoUpload,
    excluirImagem,
    obterUrlImagem
};