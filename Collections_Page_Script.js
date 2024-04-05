import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIdvoYCGYNV1_rG9JdNtz_Q1iA66k9I6o",
  authDomain: "strategy4schoolsdb.firebaseapp.com",
  projectId: "strategy4schoolsdb",
  storageBucket: "strategy4schoolsdb.appspot.com",
  messagingSenderId: "125952142437",
  appId: "1:125952142437:web:11d221ac797be1c3e0ea8c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', async () => {
    const favoritesTableBody = document.querySelector('#favoritesTable tbody');
    const deleteSelectedButton = document.getElementById('deleteSelected');

    // Listen for auth state changes
    onAuthStateChanged(auth, user => {
        if (user) {
            console.log("User is signed in, UID:", user.uid);
            populateTable(); // Call populateTable when a user is signed in
        } else {
            console.log("No user is signed in.");
            // Optional: Redirect to login page or display a message
        }
    });

    async function fetchFavorites() {
    const user = auth.currentUser;
    if (!user) {
        console.error("User not logged in");
        return [];
    }

    const favoritesCollectionRef = collection(db, "users", user.uid, "favorites");
    const querySnapshot = await getDocs(favoritesCollectionRef);

    const favorites = [];
    querySnapshot.forEach((doc) => {
        favorites.push(doc.data()); // Assuming the data structure includes fields `word` and `definition`
    });

    return favorites;
}

    async function updateFavoritesInFirestore(updatedFavorites) {
        const user = auth.currentUser;
        if (!user) {
            console.error("User not logged in");
            return;
        }

        const favoritesRef = doc(db, "users", user.uid, "gameFavorites", "favorites");
        await setDoc(favoritesRef, { words: updatedFavorites });
    }

    async function populateTable() {
        const favorites = await fetchFavorites();
        favoritesTableBody.innerHTML = '';

        if (favorites.length === 0) {
            favoritesTableBody.innerHTML = '<tr><td colspan="4">No favorite words added yet.</td></tr>';
            return;
        }

        favorites.forEach((item, index) => {
            const row = favoritesTableBody.insertRow();
            row.innerHTML = `
                <td><input type="checkbox" class="selectBox" data-index="${index}"></td>
                <td>${item.word}</td>
                <td>${item.definition}</td>
                <td><button class="deleteBtn" onclick="deleteWord(${index})"><i class="fas fa-trash"></i></button></td>
            `;
        });

        updateDeleteButtonText();
    }

    window.deleteWord = async (index) => { // Expose function to global scope
        if (!confirm('Are you sure you want to delete this word?')) return;

        const favorites = await fetchFavorites();
        favorites.splice(index, 1);
        await updateFavoritesInFirestore(favorites);
        populateTable();
    };

    window.deleteSelectedWords = async () => { // Expose function to global scope
        const selectedCheckboxes = Array.from(document.querySelectorAll('.selectBox:checked'));
        if (!selectedCheckboxes.length || !confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected word(s)?`)) return;

        const favorites = await fetchFavorites();
        selectedCheckboxes.forEach(checkbox => favorites.splice(checkbox.getAttribute('data-index'), 1));
        await updateFavoritesInFirestore(favorites);
        populateTable();
    };

    deleteSelectedButton.onclick = deleteSelectedWords;

    function updateDeleteButtonText() {
        const selectedCount = document.querySelectorAll('.selectBox:checked').length;
        deleteSelectedButton.innerText = selectedCount > 0 ? `Delete ${selectedCount} Word${selectedCount > 1 ? 's' : ''}` : 'Delete Selected';
        deleteSelectedButton.style.display = selectedCount > 0 ? 'block' : 'none';
    }

    document.addEventListener('change', e => {
        if (e.target.matches('.selectBox')) {
            updateDeleteButtonText();
        }
    });

    // Function to add words to a flashcard, needs implementation
    window.addToFlashcard = () => {
        console.log("Add to Flashcard functionality goes here.");
        document.getElementById('customContextMenu').style.display = 'none';
    };
});
