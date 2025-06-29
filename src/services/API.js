const baseURL = 'http://X.X.X.X:3000/brupholee/api';

function handleInvalidResponse(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    let type = response.headers.get(`Content-Type`);
    if (type !== null && type.indexOf(`application/json`) === -1) {
        throw new TypeError(`Expected JSON, got ${type}`);
    }
    return response;
}

const getUsers = async () => {
    return await fetch(`${baseURL}/users`)
    .then(handleInvalidResponse)
    .then(response => response.json())
    .catch(error => {
        console.error('Error: 123', error);
    });
}

const uploadPhoto = async (path, username) => {
    return await fetch(`${baseURL}/photos/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Set the content type to application/json
        },
        body: JSON.stringify({
            'path': path,
            'username': username,
        }), // Send data as JSON
    })
    .then(handleInvalidResponse)
    .then(response => response.json())
    .catch(error => {
        console.error('Error: 456', error);
    });
}

const getPhotoById = async (id) => {
    return await fetch(`${baseURL}/photos/${id}`)
    .then(handleInvalidResponse)
    .then(response => response.json())
    .catch(error => {
        console.error('Error: 789', error);
    });
}

const getAllProducts = async () => {
    try {
      const response = await fetch(`${baseURL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
}

const getCurrentSkincare = async (username) => {
  try {
    const response = await fetch(`${baseURL}/skincare/user/${username}`);

    // 🔹 Controlla se la risposta è effettivamente JSON
    const text = await response.text();

    // 🔹 Se non è JSON, lancia un errore
    if (!response.ok) {
      throw new Error("Risposta non valida: " + text);
    }

    const data = JSON.parse(text);

    // Controlla se la risposta è un array
    if (!Array.isArray(data)) {
        throw new Error("Formato della risposta non valido: " + text);
    }

    return data; // Ritorna direttamente l'array di skincare

  } catch (error) {
    console.log("Errore nel recupero dello skincare:", error);
    throw error;
  }
};

const getSkincareByIndex = async (username, index) => {
  try {
    const response = await fetch(`${baseURL}/skincare/index/${username}/${index}`);

    // Controlla se la risposta è effettivamente JSON
    const text = await response.text();

    // Se non è JSON, lancia un errore
    if (!response.ok) {
      throw new Error("Risposta non valida: " + text);
    }

    const data = JSON.parse(text);

    // Controlla se la risposta è un array
    if (!Array.isArray(data)) {
        throw new Error("Formato della risposta non valido: " + text);
    }

    return data; // Ritorna direttamente l'array di skincare

  } catch (error) {
    console.log("Errore nel recupero dello skincare:", error);
    throw error;
  }
};

const addProductToSkincare = async (skincareData) => {
  try {
      const response = await fetch(`${baseURL}/skincare/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(skincareData),
      });

      if (!response.ok) {
          throw new Error('Failed to add product to skincare');
      }
      return await response.json();
  } catch (error) {
      console.log('Error adding product to skincare:', error);
      throw error;
  }
};

const deleteProduct = async(prodID, username) => {
	try {
		const response = await fetch(`${baseURL}/skincare/delete`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ product_id: prodID, username: username }),
		});

		if (!response.ok) {
			throw new Error('Failed to delete product from skincare');
		}
		return await response.json();
	} catch (error) {
		console.log('Error deleting product from skincare:', error);
		throw error;
		}
}


const getPhotosByUser = async (username) => {
    return await fetch(`${baseURL}/photos/user/${username}`)
    .then(handleInvalidResponse)
    .then(response => response.json())
    .catch(error => {
        console.error('Error: 789', error);
    });
}


const getAvgPimples = async (username) => {
    return await fetch(`${baseURL}/photos/mean/${username}`)
    .then(handleInvalidResponse)
    .then(response => response.json())
    .catch(error => {
        console.error('Error: 789', error);
    });
}

const getLastSCData = async (username) => {
    console.log("Richiesta di getLastSCData per", username);
    return await fetch(`${baseURL}/photos/stats/${username}`)
    .then(handleInvalidResponse)
    .then(response => response.json())
    .catch(error => {
        console.error('Error: 789', error);
    });
}

const setTutorialUser = async (username) => {
    console.log("Richiesta di setTutorialUser per", username);
    return await fetch(`${baseURL}/users/tutorial/${username}`, {
        method: 'PUT'
    })
    .then(handleInvalidResponse)
    .then(response => response.json())
    .catch(error => {
        console.error('Error PIPPO: 789', error);
    });
}

const createRandomSkincare = async (username) => {
    try {
      const response = await fetch(`${baseURL}/skincare/create-random`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username })
      });
  
      if (!response.ok) {
        throw new Error("Errore nella creazione della skincare");
      }
      console.log("✅ Skincare random creata con successo");
    } catch (error) {
      console.error("❌ Errore API:", error);
      throw error;
    }
  };

	const createSkincare = async (username) => {
    try {
      const response = await fetch(`${baseURL}/skincare/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username })
      });
  
      if (!response.ok) {
        throw new Error("Errore nella creazione della skincare");
      }
      console.log("✅ Skincare creata con successo");
    } catch (error) {
      console.error("❌ Errore API:", error);
      throw error;
    }
  };

const API = {
    getUsers,
    uploadPhoto,
    getPhotoById,
    getAllProducts,
    getCurrentSkincare,
    addProductToSkincare,
    getPhotosByUser,
    getAvgPimples,
    getLastSCData,
    setTutorialUser,
    createRandomSkincare,
		deleteProduct,
		createSkincare,
    getSkincareByIndex
};

export default API;
