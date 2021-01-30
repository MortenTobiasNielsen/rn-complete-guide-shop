import AsyncStorage from "@react-native-community/async-storage";

// export const SIGNUP = "SIGNUP";
// export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";

export const authenticate = (userId, token) => {
  return { type: AUTHENTICATE, userId: userId, token: token };
};

export const signup = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB9jl8olkm5C2P3Efn6SnWKVF4mAzGcAaU",
      {
        method: "POST",
        header: {
          "Context-Type": "application.json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;

      let message = "Something Went Wrong";

      if (errorId === "EMAIL_EXISTS") {
        message = "This email already exists"; // This is bad practice, given that malicious user would be able to extract emails
      }

      throw new Error(message);
    }

    const resData = await response.json();

    authenticate;

    dispatch(authenticate(resData.localId, resData.idToken));
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB9jl8olkm5C2P3Efn6SnWKVF4mAzGcAaU",
      {
        method: "POST",
        header: {
          "Context-Type": "application.json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;

      let message = "Something Went Wrong";

      if (errorId === "EMAIL_NOT_FOUND") {
        message = "This email could not be found"; // This is bad practice, given that malicious user would be able to extract emails
      } else if (errorId === "INVALID_PASSWORD") {
        message = "This password is not valid"; // This is bad practice, given that malicious user would be able to extract emails
      }

      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(authenticate(resData.localId, resData.idToken));
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "UserData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};