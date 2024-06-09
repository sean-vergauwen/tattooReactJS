// edit.test.js

// Fonctions utilitaires extraites de edit.js
function updateForm(setForm, value) {
    setForm((prevForm) => ({ ...prevForm, ...value }));
  }
  
  async function fetchData(params, setForm, navigate) {
    const id = params.id.toString();
    const response = await fetch(`http://localhost:3001/record/${id}`);
    if (!response.ok) {
      const message = `An error has occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const record = await response.json();
    if (!record) {
      window.alert(`Record with id ${id} not found`);
      navigate("/");
      return;
    }
    setForm(record);
  }
  
  async function onSubmit(e, form, params, navigate) {
    e.preventDefault();
    const editedPerson = {
      name: form.name,
      position: form.position,
      level: form.level,
    };
    await fetch(`http://localhost:3001/update/${params.id}`, {
      method: "POST",
      body: JSON.stringify(editedPerson),
      headers: {
        "Content-Type": "application/json",
      },
    });
    navigate("/");
  }
  
  // Tests
  describe('Edit Component Utils', () => {
    beforeEach(() => {
      localStorage.clear();
    });
  
    // Tests pour updateForm
    describe('updateForm', () => {
      test('updates form state correctly', () => {
        const setForm = jest.fn();
        const value = { name: 'newName' };
  
        updateForm(setForm, value);
  
        expect(setForm).toHaveBeenCalledWith(expect.any(Function));
        const updaterFunction = setForm.mock.calls[0][0];
        const newState = updaterFunction({ name: 'oldName' });
        expect(newState).toEqual({ name: 'newName' });
      });
    });
  
    // Tests pour fetchData
    describe('fetchData', () => {
      test('fetches record data and updates state', async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ name: 'Tattoo 1', position: 'Artist', level: 'Senior' }),
          })
        );
  
        const params = { id: '123' };
        const setForm = jest.fn();
        const navigate = jest.fn();
  
        await fetchData(params, setForm, navigate);
  
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/record/123');
        expect(setForm).toHaveBeenCalledWith({ name: 'Tattoo 1', position: 'Artist', level: 'Senior' });
      });
  
      test('handles fetch error and shows alert', async () => {
        global.fetch = jest.fn(() => Promise.resolve({ ok: false, statusText: 'Not Found' }));
  
        window.alert = jest.fn();
  
        const params = { id: '123' };
        const setForm = jest.fn();
        const navigate = jest.fn();
  
        await fetchData(params, setForm, navigate);
  
        expect(window.alert).toHaveBeenCalledWith('An error has occurred: Not Found');
        expect(setForm).not.toHaveBeenCalled();
        expect(navigate).not.toHaveBeenCalled();
      });
  
      test('handles record not found and shows alert', async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(null),
          })
        );
  
        window.alert = jest.fn();
  
        const params = { id: '123' };
        const setForm = jest.fn();
        const navigate = jest.fn();
  
        await fetchData(params, setForm, navigate);
  
        expect(window.alert).toHaveBeenCalledWith('Record with id 123 not found');
        expect(setForm).not.toHaveBeenCalled();
        expect(navigate).toHaveBeenCalledWith('/');
      });
    });
  
    // Tests pour onSubmit
    describe('onSubmit', () => {
      test('submits form data and navigates on success', async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            json: () => Promise.resolve({ status: 'success' }),
          })
        );
  
        const e = { preventDefault: jest.fn() };
        const form = { name: 'Tattoo 1', position: 'Artist', level: 'Senior' };
        const params = { id: '123' };
        const navigate = jest.fn();
  
        await onSubmit(e, form, params, navigate);
  
        expect(e.preventDefault).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/update/123', expect.any(Object));
        expect(navigate).toHaveBeenCalledWith('/');
      });
  
      
    });
  });
  
  // Make sure Jest runs the test by printing a message in case it doesn't
  console.log('Tests are being executed');
  