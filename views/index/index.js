async function pingpong() {
    let response;
    try {
        response = await window.backend_comms.ping();
    }
    catch(e) {
        response = e;
    }
    document.getElementById("pong-display").innerText = JSON.stringify(response);
}

document.getElementById("ping-button").addEventListener("click", async () => pingpong());
document.getElementById("switch-button").addEventListener("click", async () => window.backend_comms.switchWindow("views/test/test.html"));