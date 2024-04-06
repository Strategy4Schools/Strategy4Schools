document.addEventListener('DOMContentLoaded', function() {
    const createFolderBtn = document.getElementById('create-folder');
    const foldersList = document.getElementById('folders-list');
    let folders = []; // This will hold the folder names

    // Function to add a new folder and make it clickable
function addFolder(folderName) {
    const listItem = document.createElement('li');
    listItem.style.cursor = "pointer";

    const icon = document.createElement('i');
    icon.className = 'fa fa-folder'; // Use Font Awesome folder icon
    icon.style.fontSize = '18px'; // Adjust icon size as needed

    const name = document.createElement('div');
    name.textContent = folderName; // Set the folder name
    name.style.marginTop = '8px'; // Space between icon and text

    listItem.appendChild(icon);
    listItem.appendChild(name); // Append the name below the icon

    listItem.onclick = function() {
        alert("Opening folder: " + folderName);
    };
    foldersList.appendChild(listItem);
}

    // Event listener for the create folder button
    createFolderBtn.addEventListener('click', function() {
        const folderName = prompt('Enter folder name:');
        if (folderName) {
            folders.push(folderName);
            addFolder(folderName);
        }
    });
});
