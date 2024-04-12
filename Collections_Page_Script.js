import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    setDoc, // Importing setDoc for setting or updating documents
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
    const addToFlashcardButton = document.getElementById('addToFlashcardSelected'); // Reference to the Add to Flashcard button

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
        querySnapshot.forEach((docSnapshot) => {
            const item = docSnapshot.data();
            item.id = docSnapshot.id; // Store the document ID with the item
            favorites.push(item);
        });

        return favorites;
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
                <td><input type="checkbox" class="selectBox" data-index="${index}" data-id="${item.id}"></td>
                <td>${item.word}</td>
                <td>${item.definition}</td>
                <td><button class="deleteBtn" onclick="deleteWord(${index})"><i class="fas fa-trash"></i></button></td>
            `;
        });

        updateActionButtonsText();
    }

    window.deleteWord = async (index) => {
        if (!confirm('Are you sure you want to delete this word?')) return;

        const favorites = await fetchFavorites();
        const docId = favorites[index].id; // Retrieve the document ID
        if (docId) {
            await deleteDoc(doc(db, "users", auth.currentUser.uid, "favorites", docId));
            populateTable(); // Refresh the table after deletion
        }
    };

    window.deleteSelectedWords = async () => {
        const selectedCheckboxes = Array.from(document.querySelectorAll('.selectBox:checked'));
        if (!selectedCheckboxes.length || !confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected word(s)?`)) return;

        for (let checkbox of selectedCheckboxes) {
            const docId = checkbox.getAttribute('data-id');
            await deleteDoc(doc(db, "users", auth.currentUser.uid, "favorites", docId));
        }
        populateTable(); // Refresh the table after all deletions
    };

    window.addToFlashcardSelected = async () => {
    const selectedCheckboxes = Array.from(document.querySelectorAll('.selectBox:checked'));
    const wordsToAdd = [];
    for (let checkbox of selectedCheckboxes) {
        const index = checkbox.getAttribute('data-index');
        const favorites = await fetchFavorites();
        wordsToAdd.push({
            word: favorites[index].word,
            definition: favorites[index].definition
        });
    }

    console.log("Adding to flashcards:", wordsToAdd);
    // Implement logic to add these words to a flashcard system
};


    deleteSelectedButton.onclick = deleteSelectedWords;
    addToFlashcardButton.onclick = addToFlashcardSelected; // Bind the button to the function

    function updateActionButtonsText() {
        const selectedCount = document.querySelectorAll('.selectBox:checked').length;
        deleteSelectedButton.innerText = selectedCount > 0 ? `Delete ${selectedCount} Word${selectedCount > 1 ? 's' : ''}` : 'Delete Selected';
        addToFlashcardButton.innerText = selectedCount > 0 ? `Add ${selectedCount} to Flashcard` : 'Add to Flashcard';
        deleteSelectedButton.style.display = selectedCount > 0 ? 'block' : 'none';
        addToFlashcardButton.style.display = selectedCount > 0 ? 'block' : 'none';
    }

    document.addEventListener('change', e => {
        if (e.target.matches('.selectBox')) {
            updateActionButtonsText();
        }
    });
});
