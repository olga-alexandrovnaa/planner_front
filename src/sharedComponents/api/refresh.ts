import $api from "./api";

const refresh = async () => {
  try {
    const response = await $api(__API__ + "auth/refresh", {
      method: "POST",
    });
    if (!response.result || response.result !== true) {
      throw new Error();
    }
    return response.data;
  } catch (e) {
    throw new Error();
  }
};

// const refreshTokenMutex = {
//   isLocked: false,
//   waiting: [],

//   lock() {
//     return new Promise(resolve => {
//       if (this.isLocked) {
//         // Если мьютекс уже заблокирован, добавляем текущий запрос в список ожидания
//         this.waiting.push(resolve);
//       } else {
//         // Если мьютекс доступен, блокируем его
//         this.isLocked = true;
//         resolve();
//       }
//     });
//   },

//   unlock() {
//     if (this.waiting.length > 0) {
//       // Если есть запросы в списке ожидания, разрешаем следующий запрос в очереди
//       const next = this.waiting.shift();
//       next();
//     } else {
//       // Если нет запросов в списке ожидания, освобождаем мьютекс
//       this.isLocked = false;
//     }
//   }
// };

// // Функция для обновления refreshToken
// async function updateRefreshToken() {
//   try {
//     // Получаем блокировку мьютекса перед обновлением refreshToken
//     await refreshTokenMutex.lock();

//     const response = await refresh();
    
//     return response;
//   } catch (error) {
//     return {
//       success: false,
//       error: error.message
//     };
//   } finally {
//     // Освобождаем мьютекс после обновления refreshToken
//     refreshTokenMutex.unlock();
//   }
// }


export default refresh;
