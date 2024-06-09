// tatoueurProfil.test.js

// Fonctions utilitaires extraites de TatoueurProfil.js
function getLocalStorageData(key) {
    const data = localStorage.getItem(key);
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  
  function handleAllData(id, setUserData, setTatoueur) {
    const data = localStorage.getItem("userData");
    const storageData = JSON.parse(data);
    setUserData(storageData);
    if (storageData) {
      try {
        fetch(`http://localhost:3001/user/tattoo/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storageData?.data?.token}`,
          },
        })
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.statusCode === 200) {
              setTatoueur(responseData?.data);
            } else {
              window.alert(responseData?.message);
            }
          })
          .catch((error) => {
            console.error(error);
            window.alert(error);
          });
      } catch (error) {
        console.error(error);
        window.alert(error);
      }
    }
  }
  
  async function handleSaveReview(id, reviewText, userData, setReviewText, setShowReviewInput, handleAllData) {
    try {
      const response = await fetch(`http://localhost:3001/user/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.data?.token}`,
        },
        body: JSON.stringify({ id: id, comment: reviewText }),
      });
  
      if (response.status === 200) {
        handleAllData();
      } else {
        throw new Error(`Une erreur est survenue : ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'avis:", error);
      window.alert("Erreur lors de l'enregistrement de l'avis.");
    } finally {
      setShowReviewInput(false);
      setReviewText("");
    }
  }
  
  async function handleAddFavourite(id, userData) {
    try {
      const response = await fetch(`http://localhost:3001/user/like/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.data?.token}`,
        },
      });
      const responseData = await response.json();
      if (responseData.statusCode === 200) {
        window.alert(responseData?.message);
      } else {
        throw new Error(`Une erreur est survenue : ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout en favoris:", error);
      window.alert("Erreur lors de l'ajout en favoris.");
    }
  }
  
  // Tests
  describe('TatoueurProfil Component Utils', () => {
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
  
      test('fetches tattoo artist data and updates state', async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            json: () => Promise.resolve({ statusCode: 200, data: { name: 'Tattoo Artist' } }),
          })
        );
  
        const id = '123';
        const setUserData = jest.fn();
        const setTatoueur = jest.fn();
  
        await handleAllData(id, setUserData, setTatoueur);
  
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/user/tattoo/123', expect.any(Object));
      });
  
      test('handles fetch error and shows alert', async () => {
        global.fetch = jest.fn(() => Promise.reject('Network error'));
  
        window.alert = jest.fn();
  
        const id = '123';
        const setUserData = jest.fn();
        const setTatoueur = jest.fn();
  
        await handleAllData(id, setUserData, setTatoueur);
  
      });
    });
  
    // Tests pour handleSaveReview
    describe('handleSaveReview', () => {
      beforeEach(() => {
        const data = { data: { token: 'dummyToken' } };
        localStorage.setItem('userData', JSON.stringify(data));
      });
  
      test('saves review and updates state on success', async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            status: 200,
            json: () => Promise.resolve({}),
          })
        );
  
        const id = '123';
        const reviewText = 'Great tattoo!';
        const userData = { data: { token: 'dummyToken' } };
        const setReviewText = jest.fn();
        const setShowReviewInput = jest.fn();
        const handleAllData = jest.fn();
  
        await handleSaveReview(id, reviewText, userData, setReviewText, setShowReviewInput, handleAllData);
  
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/user/comment', expect.any(Object));
        expect(setReviewText).toHaveBeenCalledWith('');
        expect(setShowReviewInput).toHaveBeenCalledWith(false);
        expect(handleAllData).toHaveBeenCalled();
      });
  
      test('handles save review error and shows alert', async () => {
        global.fetch = jest.fn(() => Promise.reject('Network error'));
  
        window.alert = jest.fn();
  
        const id = '123';
        const reviewText = 'Great tattoo!';
        const userData = { data: { token: 'dummyToken' } };
        const setReviewText = jest.fn();
        const setShowReviewInput = jest.fn();
        const handleAllData = jest.fn();
  
        await handleSaveReview(id, reviewText, userData, setReviewText, setShowReviewInput, handleAllData);
  
        expect(window.alert).toHaveBeenCalledWith('Erreur lors de l\'enregistrement de l\'avis.');
      });
    });
  
    // Tests pour handleAddFavourite
    describe('handleAddFavourite', () => {
      beforeEach(() => {
        const data = { data: { token: 'dummyToken' } };
        localStorage.setItem('userData', JSON.stringify(data));
      });
  
      test('adds favourite and shows success message', async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ statusCode: 200, message: 'Added to favourites' }),
          })
        );
  
        const id = '123';
        const userData = { data: { token: 'dummyToken' } };
  
        await handleAddFavourite(id, userData);
  
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/user/like/123', expect.any(Object));
        expect(window.alert).toHaveBeenCalledWith('Added to favourites');
      });
  
      test('handles add favourite error and shows alert', async () => {
        global.fetch = jest.fn(() => Promise.reject('Network error'));
  
        window.alert = jest.fn();
  
        const id = '123';
        const userData = { data: { token: 'dummyToken' } };
  
        await handleAddFavourite(id, userData);
  
        expect(window.alert).toHaveBeenCalledWith('Erreur lors de l\'ajout en favoris.');
      });
    });
  });
  
  // Make sure Jest runs the test by printing a message in case it doesn't
  console.log('Tests are being executed');
  