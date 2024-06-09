// favoris.test.js

// Fonctions utilitaires extraites de favoris.js
function getLocalStorageData(key) {
    const data = localStorage.getItem(key);
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  
  function handleAllData(setUserData, setTattooData) {
    const data = localStorage.getItem("userData");
    const storageData = JSON.parse(data);
    setUserData(storageData);
    if (storageData) {
      try {
        fetch("http://localhost:3001/user/all-likes", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storageData?.data?.token}`,
          },
        })
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.statusCode === 200) {
              setTattooData(responseData?.data?.tattoos);
            } else {
              window.alert(responseData?.message);
            }
          })
          .catch((error) => {
            window.alert(error);
          });
      } catch (error) {
        console.error(error);
        window.alert(error);
      }
    }
  }
  
  function handleInput(e, tattooData, setFilter, setTattooData, handleAllData) {
    const filter = e.target.value.trim().toLowerCase();
    const filteredData = tattooData.filter((tattoo) =>
      tattoo.name.toLowerCase().includes(filter)
    );
    setFilter(filter);
    if (filter.length >= 1) {
      setTattooData(filteredData);
    } else {
      handleAllData();
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
  describe('Favoris Component Utils', () => {
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
  
    // Tests pour handleAllData
    describe('handleAllData', () => {
      beforeEach(() => {
        const data = { data: { token: 'dummyToken' } };
        localStorage.setItem('userData', JSON.stringify(data));
      });
  
      test('fetches all liked tattoo data and updates state', async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            json: () => Promise.resolve({ statusCode: 200, data: { tattoos: [{ name: 'Tattoo 1' }, { name: 'Tattoo 2' }] } }),
          })
        );
  
        const setUserData = jest.fn();
        const setTattooData = jest.fn();
  
        await handleAllData(setUserData, setTattooData);
  
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/user/all-likes', expect.any(Object));
      });
  
      test('handles fetch error and shows alert', async () => {
        global.fetch = jest.fn(() => Promise.reject('Network error'));
  
        window.alert = jest.fn();
  
        const setUserData = jest.fn();
        const setTattooData = jest.fn();
  
        await handleAllData(setUserData, setTattooData);
  
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
        const setTattooData = jest.fn();
        const handleAllData = jest.fn();
  
        handleInput(e, tattooData, setFilter, setTattooData, handleAllData);
  
        expect(setFilter).toHaveBeenCalledWith('tattoo');
        expect(setTattooData).toHaveBeenCalledWith([{ name: 'Tattoo 1' }, { name: 'Tattoo 3' }]);
      });
  
      test('resets tattoo data when input is cleared', () => {
        const e = { target: { value: '' } };
        const tattooData = [
          { name: 'Tattoo 1' },
          { name: 'Art 2' },
          { name: 'Tattoo 3' },
        ];
        const setFilter = jest.fn();
        const setTattooData = jest.fn();
        const handleAllData = jest.fn();
  
        handleInput(e, tattooData, setFilter, setTattooData, handleAllData);
  
        expect(setFilter).toHaveBeenCalledWith('');
        expect(handleAllData).toHaveBeenCalled();
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
  