document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('json-editor');
    const saveBtn = document.getElementById('save-btn');

    // Fetch initial data
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            editor.value = JSON.stringify(data, null, 2);
        });

    // Save data
    saveBtn.addEventListener('click', () => {
        try {
            const updatedData = JSON.parse(editor.value);
            fetch('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            })
            .then(response => response.json())
            .then(result => {
                alert(result.message);
            });
        } catch (error) {
            alert('Invalid JSON format!');
        }
    });
});
