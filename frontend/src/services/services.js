import axios from "axios";

export const getUrl= async (documentId) => {

      const response = await axios.get(
        `http://127.0.0.1:8000/pdf/${documentId}`,
        {
          responseType: "blob",
        }
      );

      const file = response.data;
      const objectUrl = URL.createObjectURL(file);
        return objectUrl
     
  };

export  const uploadfile = async (file) => {
    const formdata = new FormData();

    formdata.append("file", file);

      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formdata
      );

      return response.data;
  };
export  const saveChats = async (recentChats) => {
    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/chats/save",
        recentChats
      );

      console.log(response.data.saved_count);
    } catch (error) {
      console.error(error);
    }
  };

export const get_answer =async (userQuery,document_id)=>{
    const response = await axios.post(
        "http://127.0.0.1:8000/ask",
        {
          query: userQuery,
          documentId: document_id,
        }
      );
    return response
}