import { Buffer } from "buffer";

  export const getFileURL = (file) => {
    if (!file) {
      return '';
    }
    return URL.createObjectURL(file);
  };

  export const base64ToUrl = (stream) => {
    if(!stream){
      return '';
    }
    const buffer = Buffer.from(stream, 'base64');
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    const url = getFileURL(blob);
    return url;
  }

  export const binaryToUrl = (binary) => {
    if(!binary){
      return '';
    }
    const blob = new Blob([binary], { type: 'image/jpeg' });
    const url = getFileURL(blob);
    return url;
  }