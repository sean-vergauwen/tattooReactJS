// addTattooUtils.test.js

// Fonctions utilitaires
function getLocalStorageData(key) {
  const data = localStorage.getItem(key);
  return JSON.parse(data);
}

function updateForm(prevForm, value) {
  return { ...prevForm, ...value };
}

function handleStyleChange(selectedOptions) {
  if (Array.isArray(selectedOptions)) {
    return selectedOptions.map(option => option.value).join(', ');
  } else {
    console.error('Selected options is not an array:', selectedOptions);
    return '';
  }
}

async function addTattoo(e, form, image, userData, setForm) {
  e.preventDefault();
  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("description", form.description);
  formData.append("image", image?.image);
  formData.append("tattooStyle", form?.tattooStyle);

  try {
    const response = await fetch("http://localhost:3001/artist/add-tattoo", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userData?.data?.token}`,
      },
      body: formData,
    });
    const responseData = await response.json();
    if (responseData.statusCode === 200) {
      setForm({ name: "", description: "", image: "" });
      window.alert("tattoo added successfully");
    } else {
      window.alert(responseData?.message);
    }
  } catch (error) {
    console.error(error);
    window.alert(error);
  }
}

function handleUploadImage(e, setImage) {
  const file = e.target.files[0];
  setImage({ image: file });
}

// Tests
describe('addTattooUtils', () => {
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

    
  });

  // Tests pour updateForm
  describe('updateForm', () => {
    test('updates form correctly', () => {
      const prevForm = { name: '', description: '' };
      const value = { name: 'Tattoo Name' };

      const result = updateForm(prevForm, value);
      expect(result).toEqual({ name: 'Tattoo Name', description: '' });
    });

    test('overwrites existing fields', () => {
      const prevForm = { name: 'Old Name', description: 'Old Description' };
      const value = { name: 'New Name' };

      const result = updateForm(prevForm, value);
      expect(result).toEqual({ name: 'New Name', description: 'Old Description' });
    });

    test('adds new fields', () => {
      const prevForm = { name: 'Tattoo Name' };
      const value = { description: 'Tattoo Description' };

      const result = updateForm(prevForm, value);
      expect(result).toEqual({ name: 'Tattoo Name', description: 'Tattoo Description' });
    });
  });

  // Tests pour handleStyleChange
  describe('handleStyleChange', () => {
    test('handles array input correctly', () => {
      const selectedOptions = [
        { value: 'Traditionnel', label: 'Traditionnel' },
        { value: 'Réaliste', label: 'Réaliste' },
      ];

      const result = handleStyleChange(selectedOptions);
      expect(result).toBe('Traditionnel, Réaliste');
    });

    test('handles non-array input with error', () => {
      console.error = jest.fn();

      const selectedOptions = { value: 'Traditionnel', label: 'Traditionnel' };

      const result = handleStyleChange(selectedOptions);
      expect(result).toBe('');
      expect(console.error).toHaveBeenCalledWith('Selected options is not an array:', selectedOptions);
    });

    test('handles empty array input', () => {
      const selectedOptions = [];

      const result = handleStyleChange(selectedOptions);
      expect(result).toBe('');
    });
  });

  // Tests pour handleUploadImage
  describe('handleUploadImage', () => {
    test('sets the image correctly', () => {
      const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
      const event = { target: { files: [file] } };

      const setImage = jest.fn();

      handleUploadImage(event, setImage);
      expect(setImage).toHaveBeenCalledWith({ image: file });
    });

    
  });

  // Tests pour addTattoo
  describe('addTattoo', () => {
    test('makes a POST request and resets form on success', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ statusCode: 200 }),
        })
      );

      const e = { preventDefault: jest.fn() };
      const form = { name: 'Tattoo Name', description: 'Tattoo Description', tattooStyle: 'Traditionnel' };
      const image = { image: new File(['dummy content'], 'example.png', { type: 'image/png' }) };
      const userData = { data: { token: 'dummyToken' } };
      const setForm = jest.fn();

      await addTattoo(e, form, image, userData, setForm);

      expect(e.preventDefault).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/artist/add-tattoo', expect.any(Object));
      expect(setForm).toHaveBeenCalledWith({ name: '', description: '', image: '' });
    });

    test('shows an error message on failure', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ statusCode: 500, message: 'Error occurred' }),
        })
      );

      window.alert = jest.fn();

      const e = { preventDefault: jest.fn() };
      const form = { name: 'Tattoo Name', description: 'Tattoo Description', tattooStyle: 'Traditionnel' };
      const image = { image: new File(['dummy content'], 'example.png', { type: 'image/png' }) };
      const userData = { data: { token: 'dummyToken' } };
      const setForm = jest.fn();

      await addTattoo(e, form, image, userData, setForm);

      expect(e.preventDefault).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/artist/add-tattoo', expect.any(Object));
      expect(window.alert).toHaveBeenCalledWith('Error occurred');
    });

    test('handles network error', async () => {
      global.fetch = jest.fn(() => Promise.reject('Network error'));

      window.alert = jest.fn();

      const e = { preventDefault: jest.fn() };
      const form = { name: 'Tattoo Name', description: 'Tattoo Description', tattooStyle: 'Traditionnel' };
      const image = { image: new File(['dummy content'], 'example.png', { type: 'image/png' }) };
      const userData = { data: { token: 'dummyToken' } };
      const setForm = jest.fn();

      await addTattoo(e, form, image, userData, setForm);

      expect(e.preventDefault).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Network error');
    });
  });
});
