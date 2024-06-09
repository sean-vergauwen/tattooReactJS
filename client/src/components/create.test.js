// create.test.js

// Fonctions utilitaires extraites de create.js
function getLocalStorageData(key) {
    const data = localStorage.getItem(key);
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  
  function setLocalStorageData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  function updateForm(setForm, value) {
    setForm(prevForm => ({ ...prevForm, ...value }));
  }
  
  function handleStyleChange(e, setForm) {
    const selectedValue = e.target.value;
    setForm(prevForm => ({
      ...prevForm,
      tattooStyle: selectedValue,
    }));
  }
  
  async function onSubmit(e, loginData, setLoginData, navigate, setUserData) {
    e.preventDefault();
    const newPerson = {
      userName: loginData?.userName,
      password: loginData?.password,
    };
  
    try {
      const response = await fetch("http://localhost:3001/artist/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPerson),
      });
      const responseData = await response.json();
      if (responseData.statusCode === 200) {
        const loginResponse = await fetch("http://localhost:3001/user/user-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPerson),
        });
        const loginData = await loginResponse.json();
        if (loginData.statusCode === 200) {
          localStorage.setItem("userData", JSON.stringify(loginData));
          setUserData(loginData);
          navigate("/");
        }
      } else {
        window.alert(responseData?.message);
      }
      setLoginData({ userName: "", password: "" });
    } catch (error) {
      
      window.alert(error);
    }
  }
  
  async function onSubmitArtist(e, form, setForm, navigate) {
    e.preventDefault();
    const newPerson = { ...form };
  
    try {
      const response = await fetch("http://localhost:3001/artist/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPerson),
      });
      const responseData = await response.json();
      if (responseData.statusCode === 200) {
        const artistLogin = {
          userName: form?.userName,
          password: form?.password,
        };
        const loginResponse = await fetch("http://localhost:3001/artist/artist-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(artistLogin),
        });
        const loginData = await loginResponse.json();
        if (loginData.statusCode === 200) {
          localStorage.setItem("userData", JSON.stringify(loginData));
          navigate("/");
        }
      } else {
        window.alert(responseData?.message);
      }
      setForm({
        userName: "",
        password: "",
        address: "",
        website: "",
        tattooStyle: "",
      });
    } catch (error) {
      
      window.alert(error);
    }
  }
  
  // Tests
  describe('Create Component Utils', () => {
    beforeEach(() => {
      localStorage.clear();
    });
  
    // Tests pour getLocalStorageData
    describe('getLocalStorageData', () => {
      test('returns parsed data from localStorage', () => {
        const data = { token: 'dummyToken' };
        localStorage.setItem('userData', JSON.stringify(data));
  
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
  
    // Tests pour updateForm
    describe('updateForm', () => {
      test('updates form state correctly', () => {
        const setForm = jest.fn();
        const value = { userName: 'newUser' };
  
        updateForm(setForm, value);
  
        expect(setForm).toHaveBeenCalledWith(expect.any(Function));
        const updaterFunction = setForm.mock.calls[0][0];
        const newState = updaterFunction({ userName: 'oldUser' });
        expect(newState).toEqual({ userName: 'newUser' });
      });
    });
  
    // Tests pour handleStyleChange
    describe('handleStyleChange', () => {
      test('updates selected tattoo style in form state', () => {
        const e = { target: { value: 'Traditionnel' } };
        const setForm = jest.fn();
  
        handleStyleChange(e, setForm);
  
        expect(setForm).toHaveBeenCalledWith(expect.any(Function));
        const updaterFunction = setForm.mock.calls[0][0];
        const newState = updaterFunction({ tattooStyle: '' });
        expect(newState).toEqual({ tattooStyle: 'Traditionnel' });
      });
    });
  
    // Tests pour onSubmit
    describe('onSubmit', () => {
      test('submits form data and updates state on success', async () => {
        global.fetch = jest.fn((url) =>
          Promise.resolve({
            json: () =>
              url.includes("add-user")
                ? Promise.resolve({ statusCode: 200 })
                : Promise.resolve({ statusCode: 200, data: { token: 'userToken' } }),
          })
        );
  
        const e = { preventDefault: jest.fn() };
        const loginData = { userName: 'testUser', password: 'testPassword' };
        const setLoginData = jest.fn();
        const navigate = jest.fn();
        const setUserData = jest.fn();
  
        await onSubmit(e, loginData, setLoginData, navigate, setUserData);
  
        expect(e.preventDefault).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/artist/add-user', expect.any(Object));
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/user/user-login', expect.any(Object));
        expect(localStorage.getItem('userData')).toBeTruthy();
        expect(setLoginData).toHaveBeenCalledWith({ userName: '', password: '' });
        expect(navigate).toHaveBeenCalledWith('/');
        expect(setUserData).toHaveBeenCalledWith(expect.any(Object));
      });
  
      test('handles submit error and shows alert', async () => {
        global.fetch = jest.fn(() => Promise.reject('Network error'));
  
        const e = { preventDefault: jest.fn() };
        const loginData = { userName: 'testUser', password: 'testPassword' };
        const setLoginData = jest.fn();
        const navigate = jest.fn();
        const setUserData = jest.fn();
  
        window.alert = jest.fn();
  
        await onSubmit(e, loginData, setLoginData, navigate, setUserData);
  
        expect(window.alert).toHaveBeenCalledWith('Network error');
      });
    });
  
    // Tests pour onSubmitArtist
    describe('onSubmitArtist', () => {
      test('submits form data and updates state on success', async () => {
        global.fetch = jest.fn((url) =>
          Promise.resolve({
            json: () =>
              url.includes("registration")
                ? Promise.resolve({ statusCode: 200 })
                : Promise.resolve({ statusCode: 200, data: { token: 'artistToken' } }),
          })
        );
  
        const e = { preventDefault: jest.fn() };
        const form = { userName: 'testArtist', password: 'testPassword', address: '123 Street', website: 'example.com', tattooStyle: 'Traditionnel' };
        const setForm = jest.fn();
        const navigate = jest.fn();
  
        await onSubmitArtist(e, form, setForm, navigate);
  
        expect(e.preventDefault).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/artist/registration', expect.any(Object));
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/artist/artist-login', expect.any(Object));
        expect(localStorage.getItem('userData')).toBeTruthy();
        expect(setForm).toHaveBeenCalledWith({ userName: '', password: '', address: '', website: '', tattooStyle: '' });
        expect(navigate).toHaveBeenCalledWith('/');
      });
  
      test('handles submit error and shows alert', async () => {
        global.fetch = jest.fn(() => Promise.reject('Network error'));
  
        const e = { preventDefault: jest.fn() };
        const form = { userName: 'testArtist', password: 'testPassword', address: '123 Street', website: 'example.com', tattooStyle: 'Traditionnel' };
        const setForm = jest.fn();
        const navigate = jest.fn();
  
        window.alert = jest.fn();
  
        await onSubmitArtist(e, form, setForm, navigate);
  
        expect(window.alert).toHaveBeenCalledWith('Network error');
      });
    });
  });
  
  // Make sure Jest runs the test by printing a message in case it doesn't
  console.log('Tests are being executed');
  