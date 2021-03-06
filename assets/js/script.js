window.onload = function() {
    const channels = document.getElementById("channels");
    const channelArr = ["esl_sc2", "div_io", "freecodecamp", "thepetcollective", "twitchpresents"];
    let channelsURL = "https://wind-bow.glitch.me/twitch-api/channels/";

    // Add channels
    function addChannels(data) {
        const name = data.display_name;
        const game = data.game;
        const logo = data.logo ? data.logo : "https://static-cdn.jtvnw.net/jtv_user_pictures/dd542e0da09855b6-profile_image-300x300.jpeg";
        const topic = data.status;
        const url = data.url;
        let content = '';

        // Fetch status of channels
        fetch(`https://wind-bow.glitch.me/twitch-api/streams/${data.name}`)
            .then(res => res.json())
            .then(renderChannels)
            .then(filterChannels)
            .catch(err => requestError(err, "query"));
        
        // Render channels
        function renderChannels(response) {
            if (response.stream) {
                content += `<div class="online">
                    <a href=${url} target="_blank">
                        <h2 id="${name}-name" class="channel-header">${name}</h2>
                        <img src="${logo}"></img>
                        <h2 id="${game}-game">${game}</h2>
                        <h2 id="live">Online</h2>
                        <h3 id="${topic}">${topic}</h3>
                    </a>
                </div>`;
            } 
            else {
                content += `<div class="offline">
                    <a href=${url} target="_blank">
                        <h2 id="${name}-name" class="channel-header">${name}</h2>
                        <img src="${logo}"></img>
                        <h2 id="${game}-game">${game}</h2>
                        <h2 id="live">Offline</h2>
                        <h3 id="${topic}">No current stream</h3>
                    </a>
                </div>`;
            }

        channels.insertAdjacentHTML('beforeend', content);
        }

        // Filter Channels
        function filterChannels() {
            const allButton = document.getElementById("all-button");
            const onlineButton = document.getElementById("online-button");
            const offlineButton = document.getElementById("offline-button");
            const onlineChannels = document.querySelectorAll("div.online");
            const offlineChannels = document.querySelectorAll("div.offline");
            allButton.classList.add("active");

            // Filter all channels
            allButton.addEventListener("click", function() {
                allButton.classList.add("active");
                const removeOnline = onlineButton.classList.remove("active");
                const removeOffline =offlineButton.classList.remove("active");

                for (const channel of onlineChannels) {
                    channel.classList.remove("hidden");
                }
                for (const channel of offlineChannels) {
                    channel.classList.remove("hidden");
                }
            })

            // Filter online channels
            onlineButton.addEventListener("click", function() {
                allButton.classList.remove("active");
                onlineButton.classList.add("active");
                offlineButton.classList.remove("active");

                for (const channel of onlineChannels) {
                    channel.classList.remove("hidden");
                }
                for (const channel of offlineChannels) {
                    channel.classList.add("hidden");
                }
            })
            
            // Filter offline channels
            offlineButton.addEventListener("click", function() {
                allButton.classList.remove("active");
                onlineButton.classList.remove("active");
                offlineButton.classList.add("active");

                for (const channel of onlineChannels) {
                    channel.classList.add("hidden");
                }
                for (const channel of offlineChannels) {
                    channel.classList.remove("hidden");
                }
            })
        }
    }
    
    // Fetch info of channels 
    channelArr.forEach(function(channel) {
        fetch(`https://wind-bow.glitch.me/twitch-api/channels/${channel}`)
        .then(res => res.json())
        .then(addChannels)
        .catch(err => requestError(err, "query"));
    })
    
    // Error function
    function requestError(part) {
        channels.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
    }
};