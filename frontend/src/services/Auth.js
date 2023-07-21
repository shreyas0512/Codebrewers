//to register
const API_URL = "http://localhost:3001/";
const register = (username, password) => {
    fetch(API_URL + "register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        })
    }).then((response) => {
            response.json().then((data) => {
                console.log(data);
            }
            );
    });
};
            

const login = (username, password) => {
    return new Promise((resolve, reject) => {
      fetch(API_URL + "login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })
        .then((response) => {
          // If the login is successful, resolve the promise with the response data
          resolve(response.data);
        })
        .catch((error) => {
          // If any error occurred during the fetch or login process, reject the promise with the error
          reject(error);
        });
    });
  };
  





export {register,login};