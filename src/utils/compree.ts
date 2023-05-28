import * as compressing from 'compressing';

export const unCompressFile = async (sourcePath: string, destPath: string) => {
    // tgz
    if (sourcePath.endsWith('tgz')) {
        try {
            await compressing.tgz.uncompress(sourcePath, destPath);
        } catch (error) {
            throw new Error(error);
        }

        return;
    }

    if (sourcePath.endsWith('gzip')) {
        try {
            await compressing.gzip.uncompress(sourcePath, destPath);
        } catch (error) {
            throw new Error(error);
        }

        return;
    }

    if (sourcePath.endsWith('tar')) {
        try {
            await compressing.tar.uncompress(sourcePath, destPath);
        } catch (error) {
            throw new Error(error);
        }

        return;
    }

    if (sourcePath.endsWith('zip')) {
        try {
            await compressing.zip.uncompress(sourcePath, destPath);
        } catch (error) {
            throw new Error(error);
        }

        return;
    }

    throw new Error('只支持 tar，gzip ,tgz ,zip 形式的压缩包!');
};

export const compressFile = async (sourcePath: string, destPath: string) => {
    // tgz
    if (destPath.endsWith('tgz')) {
        try {
            await compressing.tgz.compressDir(sourcePath, destPath);
        } catch (error) {
            throw new Error(error);
        }

        return;
    }

    if (destPath.endsWith('tar')) {
        try {
            await compressing.tar.compressDir(sourcePath, destPath);
        } catch (error) {
            throw new Error(error);
        }

        return;
    }

    if (destPath.endsWith('zip')) {
        try {
            await compressing.zip.compressDir(sourcePath, destPath);
        } catch (error) {
            throw new Error(error);
        }

        return;
    }

    throw new Error('只支持, tar,tgz ,zip 的压缩!');
};
