import axios from "axios";

const BASE_URL = "http://localhost:4000/api";

export const SignUpAdmin = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/admin/register`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const LoginAdmin = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/admin/login`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};


export const createClass = async (classData) => {
  try {
    const response = await axios.post(`${BASE_URL}/classes/create`, classData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const updateClass = async (id , classData) => {
  try {
    const response = await axios.put(`${BASE_URL}/classes/update/${id}`, classData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const deleteClass = async (id ) => {
  try {
    const response = await axios.delete(`${BASE_URL}/classes/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const getClass = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/classes/get`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const getClassById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/classes/get/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const getAllClasses = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/classes/get/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const enrollmentStat = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/enrollment-stats?classId=${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};



export const uploadClassVideo = async (id, formData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/classes/${id}/videos`,
      formData,
      {
        withCredentials: true,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const getProfile = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/profile/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const getAllProfile = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/profile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const getAdminProfile = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/profile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const updateProfile = async (id , userData) => {
  try {
    const response = await axios.put(`${BASE_URL}/admin/update/${id}` , userData , {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const getProfileById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/profile/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const createInstructor = async (formData) => {
  try {
    const formDataToSend = new FormData();

    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((item, index) => {
          formDataToSend.append(`${key}[${index}]`, item);
        });
      } 
      else if (formData[key] instanceof File) {
        formDataToSend.append(key, formData[key]);
      } 
      else if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key]);
      }
    });

    const response = await axios.post(`${BASE_URL}/instructors/create`, formDataToSend, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error in createInstructor:", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error;
  }
};


export const getInstructor = async () => {
  try {

    const response = await axios.get(`${BASE_URL}/instructors/get`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error in createInstructor:", error);
    throw error;
  }
};

export const getInstructorById = async (id) => {
  try {

    const response = await axios.get(`${BASE_URL}/instructors/get/${id}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error in createInstructor:", error);
    throw error;
  }
};

export const deleteInstructor = async (id) => {
  try {

    const response = await axios.delete(`${BASE_URL}/instructors/delete/${id}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error in createInstructor:", error);
    throw error;
  }
};

export const getPayments = async ()=>{
  try {
    const response = await axios.get(`${BASE_URL}/payments`,{
      withCredentials : true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
}

export const getFeedback = async ()=>{
  try {
    const response = await axios.get(`${BASE_URL}/contact/get`,{
      withCredentials : true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
}

export const createBlog = async ({formData})=>{
  try {
    const response = await axios.get(`${BASE_URL}/blog` ,formData , {
      withCredentials : true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response
  }
}

export const getBlog = async ()=>{
  try {
    const response = await axios.get(`${BASE_URL}/blog/get`,{
      withCredentials : true,
    })
    return response.data;
  } catch (error) {
    
  }
}