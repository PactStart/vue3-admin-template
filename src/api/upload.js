import request from "../utils/request";
/**
 * 上传图片文件
 */
export const uploadImageFile = (data) => {
    return request({ 
        method: "post", 
        url: "/api/v1/file/upload_image", 
        data,
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
};

/**
 * 上传blob图片文件
 */
export const uploadBlobFile = (data) => {
    return request({ method: "post", url: "/api/v1/file/upload_blob_image", data });
};
