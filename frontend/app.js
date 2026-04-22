const API_URL = 'http://localhost:3000/users';

const userForm = document.getElementById('userForm');
const userList = document.getElementById('userList');
const formTitle = document.getElementById('formTitle');
const cancelBtn = document.getElementById('cancelBtn');

let isEditing = false;

// Fetch all users
async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderUsers(data.users);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Render users table
function renderUsers(users) {
    userList.innerHTML = users.map(user => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-800">${user.id}</td>
            <td class="px-6 py-4 text-sm text-gray-800">${user.name}</td>
            <td class="px-6 py-4 text-sm text-gray-800">${user.email}</td>
            <td class="px-6 py-4 text-sm text-gray-500">${new Date(user.createdAt).toLocaleDateString()}</td>
            <td class="px-6 py-4 text-sm space-x-2">
                <button onclick="editUser(${user.id}, '${user.name}', '${user.email}')" 
                    class="text-blue-600 hover:text-blue-800">Edit</button>
                <button onclick="deleteUser(${user.id})" 
                    class="text-red-600 hover:text-red-800">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Handle form submit
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('userId').value;
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;

    const data = { name, email };
    if (password) data.password = password;

    try {
        let response;
        if (isEditing) {
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        const result = await response.json();
        if (result.error) {
            alert(result.error);
        } else {
            userForm.reset();
            resetForm();
            fetchUsers();
        }
    } catch (error) {
        console.error('Error saving user:', error);
    }
});

// Edit user
window.editUser = (id, name, email) => {
    isEditing = true;
    formTitle.innerText = 'Edit User';
    cancelBtn.classList.remove('hidden');
    
    document.getElementById('userId').value = id;
    document.getElementById('userName').value = name;
    document.getElementById('userEmail').value = email;
    document.getElementById('userPassword').required = false;
    document.getElementById('userPassword').placeholder = '(Leave blank to keep current)';
};

// Delete user
window.deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

// Reset form
function resetForm() {
    isEditing = false;
    formTitle.innerText = 'Add New User';
    cancelBtn.classList.add('hidden');
    document.getElementById('userId').value = '';
    document.getElementById('userPassword').required = true;
    document.getElementById('userPassword').placeholder = 'Password';
}

cancelBtn.addEventListener('click', () => {
    userForm.reset();
    resetForm();
});

// Initial load
fetchUsers();
