function saveOptions() {
    var status = document.getElementById("status");

    localStorage.setItem('settings', JSON.stringify({
            host: document.getElementById('host').value,
            port: document.getElementById('port').value
        })
    );

    status.innerHTML = "Options Saved.";

    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
}

function restoreOptions() {
    if (localStorage['settings']) {
        var settings = JSON.parse(localStorage.getItem('settings'));
    }

    document.getElementById('host').value = settings.host;
    document.getElementById('port').value = settings.port;
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('#save').addEventListener('click', saveOptions);