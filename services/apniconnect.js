import axios from "axios";

const axiosInstance=axios.create({});

const apiConnector = async (method, url, bodyData, headers, params) => {
    console.log("API call initiated", method, url);
    return axiosInstance({
      method: method,
      url: url,
      data: bodyData?bodyData:null,
      headers: headers?headers:null,
      params: params?params:null
  })
  };
  
export  {axiosInstance,apiConnector} 