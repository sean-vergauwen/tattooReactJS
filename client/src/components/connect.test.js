// connect.test.js

// Fonctions utilitaires extraites de connect.js
function getLocalStorageData(key) {
    const data = localStorage.getItem(key);
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }
  
  function setLocalStorageData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  function clearLocalStorage() {
    localStorage.clear();
  }
  
  async function userLogin(userLogin, setStoragedata, navigate) {
    try {
      const response = await fetch("http://localhost:3001/user/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userLogin),
      });
      const responseData = await response.json();
      if (responseData.statusCode === 200) {
        setLocalStorageData("token", responseData?.data?.token);
        setLocalStorageData("userData", responseData);
        setStoragedata(responseData);
        navigate("/");
      } else {
        return responseData?.message;
      }
    } catch (error) {
      
      return error;
    }
  }
  
  async function artistLogin(form, setStoragedata, navigate) {
    const artistLogin = {
      userName: form?.userName,
      password: form?.password,
    };
  
    try {
      const response = await fetch("http://localhost:3001/artist/artist-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(artistLogin),
      });
      const responseData = await response.json();
      if (responseData.statusCode === 200) {
        setLocalStorageData("token", responseData?.data?.token);
        setLocalStorageData("userData", responseData);
        setStoragedata(responseData);
        navigate("/");
      } else {
        return responseData?.message;
      }
    } catch (error) {
      
      return error;
    }
  }
  
  // Tests
  describe('Connect Component Utils', () => {
    beforeEach(() => {
      clearLocalStorage();
    });
  
    // Tests pour getLocalStorageData
    describe('getLocalStorageData', () => {
      test('returns parsed data from localStorage', () => {
        const data = { token: 'dummyToken' };
        setLocalStorageData('userData', data);
  
        const result = getLocalStorageData('userData');
        expect(result).toEqual(data);
      });
  
      test('returns null for non-existent key', () => {
        const result = getLocalStorageData('nonExistentKey');
        expect(result).toBeNull();
      });
  
      test('returns null for invalid JSON', () => {
        localStorage.setItem('invalidData', '{invalidJSON');
        const result = getLocalStorageData('invalidData');
        expect(result).toBeNull();
      });
    });
  
    // Tests pour setLocalStorageData
    describe('setLocalStorageData', () => {
      test('stores data in localStorage', () => {
        const data = { token: 'dummyToken' };
        setLocalStorageData('userData', data);
  
        const storedData = localStorage.getItem('userData');
        expect(storedData).toBe(JSON.stringify(data));
      });
  
      test('overwrites existing data in localStorage', () => {
        const initialData = { token: 'initialToken' };
        const newData = { token: 'newToken' };
        setLocalStorageData('userData', initialData);
        setLocalStorageData('userData', newData);
  
        const storedData = localStorage.getItem('userData');
        expect(storedData).toBe(JSON.stringify(newData));
      });
    });
  
    // Tests pour clearLocalStorage
    describe('clearLocalStorage', () => {
      test('clears all data from localStorage', () => {
        const data = { token: 'dummyToken' };
        setLocalStorageData('userData', data);
        clearLocalStorage();
  
        const storedData = localStorage.getItem('userData');
        expect(storedData).toBeNull();
      });
    });
  
    // Tests pour userLogin
    describe('userLogin', () => {
      test('makes a POST request and stores data on success', async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            json: () => Promise.resolve({ statusCode: 200, data: { token: 'userToken' } }),
          })
        );
  
        const userLoginData = { userName: 'testUser', password: 'testPassword' };
        const setStoragedata = jest.fn();
        const navigate = jest.fn();
  
        await userLogin(userLoginData, setStoragedata, navigate);
  
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/user/user-login', expect.any(Object));
        expect(localStorage.getItem('token')).toBe(JSON.stringify('userToken'));
        expect(localStorage.getItem('userData')).toBeTruthy();
        expect(setStoragedata).toHaveBeenCalledWith(expect.any(Object));
        expect(navigate).toHaveBeenCalledWith('/');
      });
  
      test('handles login failure', async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            json: () => Promise.resolve({ statusCode: 500, message: 'Login failed' }),
          })
        );
  
        const userLoginData = { userName: 'testUser', password: 'testPassword' };
        const setStoragedata = jest.fn();
        const navigate = jest.fn();
  
        const errorMessage = await userLogin(userLoginData, setStoragedata, navigate);
  
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/user/user-login', expect.any(Object));
        expect(errorMessage).toBe('Login failed');
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('userData')).toBeNull();
        expect(setStoragedata).not.toHaveBeenCalled();
        expect(navigate).not.toHaveBeenCalled();
      });
  
      test('handles network error', async () => {
        global.fetch = jest.fn(() => Promise.reject('Network error'));
  
        const userLoginData = { userName: 'testUser', password: 'testPassword' };
        const setStoragedata = jest.fn();
        const navigate = jest.fn();
  
        const errorMessage = await userLogin(userLoginData, setStoragedata, navigate);
  
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/user/user-login', expect.any(Object));
        expect(errorMessage).toBe('Network error');
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('userData')).toBeNull();
        expect(setStoragedata).not.toHaveBeenCalled();
        expect(navigate).not.toHaveBeenCalled();
      });
    });
  
    // Tests pour artistLogin
    describe('artistLogin', () => {
      test('makes a POST request and stores data on success', async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            json: () => Promise.resolve({ statusCode: 200, data: { token: 'artistToken' } }),
          })
        );
  
        const artistLoginData = { userName: 'testArtist', password: 'testPassword' };
        const setStoragedata = jest.fn();
        const navigate = jest.fn();
  
        await artistLogin(artistLoginData, setStoragedata, navigate);
  
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/artist/artist-login', expect.any(Object));
        expect(localStorage.getItem('token')).toBe(JSON.stringify('artistToken'));
        expect(localStorage.getItem('userData')).toBeTruthy();
        expect(setStoragedata).toHaveBeenCalledWith(expect.any(Object));
        expect(navigate).toHaveBeenCalledWith('/');
      });
  
      test('handles login failure', async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            json: () => Promise.resolve({ statusCode: 500, message: 'Login failed' }),
          })
        );
  
        const artistLoginData = { userName: 'testArtist', password: 'testPassword' };
        const setStoragedata = jest.fn();
        const navigate = jest.fn();
  
        const errorMessage = await artistLogin(artistLoginData, setStoragedata, navigate);
  
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/artist/artist-login', expect.any(Object));
        expect(errorMessage).toBe('Login failed');
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('userData')).toBeNull();
        expect(setStoragedata).not.toHaveBeenCalled();
        expect(navigate).not.toHaveBeenCalled();
      });
  
      test('handles network error', async () => {
        global.fetch = jest.fn(() => Promise.reject('Network error'));
  
        const artistLoginData = { userName: 'testArtist', password: 'testPassword' };
        const setStoragedata = jest.fn();
        const navigate = jest.fn();
  
        const errorMessage = await artistLogin(artistLoginData, setStoragedata, navigate);
  
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/artist/artist-login', expect.any(Object));
        expect(errorMessage).toBe('Network error');
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('userData')).toBeNull();
        expect(setStoragedata).not.toHaveBeenCalled();
        expect(navigate).not.toHaveBeenCalled();
      });
    });
  });
  
  // Make sure Jest runs the test by printing a message in case it doesn't
  console.log('Tests are being executed');
  