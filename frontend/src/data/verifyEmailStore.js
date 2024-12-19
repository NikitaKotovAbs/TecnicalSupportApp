import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL

const verifyEmailStore = async (userId, verificationCode) => {

  try {
    console.log("UserId:", userId)
    const response = await axios.post(`${API_URL}/api/verify_code/`, {
      user_id: userId,
      code: verificationCode,
    });

    if (response.status === 200) {
      return {
        success: true,
        message: 'Пользователь успешно подтверждён!',
      };
    } else {
      return {
        success: false,
        message: 'Ошибка при верификации.',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Произошла ошибка во время верификации',
    };
  }
};

export default verifyEmailStore;
