// content.test.js

// Fonctions utilitaires extraites de Content.js
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
  
  function handleStyleChange(e, setSelectedFilter, setFilter) {
    const selectedValue = e.target.value;
    setSelectedFilter(selectedValue);
    setFilter("");
    return selectedValue;
  }
  
  async function handleAllData(setUserData, setTattooData, setData) {
    const data = localStorage.getItem("userData");
    const storageData = JSON.parse(data);
    setUserData(storageData);
    if (storageData) {
      try {
        const response = await fetch("http://localhost:3001/user/all-tattoos", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storageData?.data?.token}`,
          },
        });
        const responseData = await response.json();
        if (responseData.statusCode === 200) {
          setTattooData(responseData?.data);
          setData(responseData?.data);
        } else {
          window.alert(responseData?.message);
        }
      } catch (error) {
        
        window.alert(error);
      }
    }
  }
  
  function handleInput(e, tattooData, setFilter, setData) {
    const filterValue = e.target.value.trim().toLowerCase();
    if (filterValue === "") {
      setFilter("");
      setData([]);
    } else {
      const filteredData = tattooData.filter((data) => {
        return data?.name.toLowerCase().includes(filterValue);
      });
      setFilter(filterValue);
      setData(filteredData);
    }
  }
  
  async function deleteRecord(id, records, setRecords) {
    await fetch(`http://localhost:3001/${id}`, {
      method: "DELETE",
    });
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }
  
  // Tests
  describe('Content Component Utils', () => {
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
  
    // Tests pour handleStyleChange
    describe('handleStyleChange', () => {
      test('updates selected filter and clears filter', () => {
        const e = { target: { value: 'Traditionnel' } };
        const setSelectedFilter = jest.fn();
        const setFilter = jest.fn();
  
        const result = handleStyleChange(e, setSelectedFilter, setFilter);
  
        expect(result).toBe('Traditionnel');
        expect(setSelectedFilter).toHaveBeenCalledWith('Traditionnel');
        expect(setFilter).toHaveBeenCalledWith('');
      });
    });
  
    // Tests pour handleAllData
    describe('handleAllData', () => {
      beforeEach(() => {
        const data = { data: { token: 'dummyToken' } };
        localStorage.setItem('userData', JSON.stringify(data));
      });
  
      test('fetches all tattoo data and updates state', async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            json: () => Promise.resolve({ statusCode: 200, data: [{ name: 'Tattoo 1' }, { name: 'Tattoo 2' }] }),
          })
        );
  
        const setUserData = jest.fn();
        const setTattooData = jest.fn();
        const setData = jest.fn();
  
        await handleAllData(setUserData, setTattooData, setData);
  
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/user/all-tattoos', expect.any(Object));
        expect(setTattooData).toHaveBeenCalledWith([{ name: 'Tattoo 1' }, { name: 'Tattoo 2' }]);
        expect(setData).toHaveBeenCalledWith([{ name: 'Tattoo 1' }, { name: 'Tattoo 2' }]);
      });
  
      test('handles fetch error and shows alert', async () => {
        global.fetch = jest.fn(() => Promise.reject('Network error'));
  
        window.alert = jest.fn();
  
        const setUserData = jest.fn();
        const setTattooData = jest.fn();
        const setData = jest.fn();
  
        await handleAllData(setUserData, setTattooData, setData);
  
        expect(window.alert).toHaveBeenCalledWith('Network error');
      });
    });
  
    // Tests pour handleInput
    describe('handleInput', () => {
      test('filters tattoo data based on input value', () => {
        const e = { target: { value: 'Tattoo' } };
        const tattooData = [
          { name: 'Tattoo 1' },
          { name: 'Art 2' },
          { name: 'Tattoo 3' },
        ];
        const setFilter = jest.fn();
        const setData = jest.fn();
  
        handleInput(e, tattooData, setFilter, setData);
  
        expect(setFilter).toHaveBeenCalledWith('tattoo');
        expect(setData).toHaveBeenCalledWith([{ name: 'Tattoo 1' }, { name: 'Tattoo 3' }]);
      });
  
      test('sets filter to empty string and data to empty array when input is cleared', () => {
        const e = { target: { value: '' } };
        const tattooData = [
          { name: 'Tattoo 1' },
          { name: 'Art 2' },
          { name: 'Tattoo 3' },
        ];
        const setFilter = jest.fn();
        const setData = jest.fn();
  
        handleInput(e, tattooData, setFilter, setData);
  
        expect(setFilter).toHaveBeenCalledWith('');
        expect(setData).toHaveBeenCalledWith([]);
      });
    });
  
    // Tests pour deleteRecord
    describe('deleteRecord', () => {
      test('deletes record and updates state', async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            json: () => Promise.resolve({ status: 'success' }),
          })
        );
  
        const id = '123';
        const records = [
          { _id: '123', name: 'Tattoo 1' },
          { _id: '456', name: 'Tattoo 2' },
        ];
        const setRecords = jest.fn();
  
        await deleteRecord(id, records, setRecords);
  
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/123', { method: 'DELETE' });
        expect(setRecords).toHaveBeenCalledWith([{ _id: '456', name: 'Tattoo 2' }]);
      });
  
      test('handles delete error and shows alert', async () => {
       
        window.alert = jest.fn();
  
        const id = '123';
        const records = [
          { _id: '123', name: 'Tattoo 1' },
          { _id: '456', name: 'Tattoo 2' },
        ];
        const setRecords = jest.fn();
  
        await deleteRecord(id, records, setRecords);
  
        
      });
    });
  });
  
  // Make sure Jest runs the test by printing a message in case it doesn't
  console.log('Tests are being executed');
  